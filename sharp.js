// Sharp pictures at any size. SillyTavern's thumbnails are small (backgrounds 160×90, avatars
// 96×144), so wherever one is drawn bigger than that in device pixels (the Backgrounds page,
// avatars on a phone's 3x screen) it would look soft or pixelated. There the full picture is
// fetched once, scaled down in the browser to the size on screen, and drawn instead, through
// --dsc-sharp: SillyTavern's own src and background-image are left as they are.

import { GatedObserver } from './life.js';

const THUMBNAIL = /\/thumbnail\?type=(bg|avatar|persona)&file=([^&]+)/;
const FOLDERS = { bg: 'backgrounds', avatar: 'characters', persona: 'User Avatars' };
/** Drawn more than this much larger than its source, a picture is swapped for a sharp one */
const SOFT = 1.1;
/** Sharp copies are made in steps of this many device pixels, so a few cover every size */
const STEP = 64;

/** full picture URL and width → Promise of an object URL (or the full URL if it's small) */
const made = new Map();
let queue = Promise.resolve();

/** The full picture behind a thumbnail URL, or '' if it isn't one. */
function fullPicture(thumbnailUrl) {
    const match = THUMBNAIL.exec(thumbnailUrl);
    return match ? `${FOLDERS[match[1]]}/${encodeURIComponent(decodeURIComponent(match[2]))}` : '';
}

/** A copy of the picture at url, scaled down to at least width × height device pixels. */
function sharpCopy(url, width, height) {
    const key = `${url}@${Math.ceil(width / STEP) * STEP}x${Math.ceil(height / STEP) * STEP}`;
    if (!made.has(key)) {
        // one at a time: each decodes a full-size picture
        const job = queue.then(async () => {
            const bitmap = await createImageBitmap(await (await fetch(url)).blob());
            const scale = Math.max(width / bitmap.width, height / bitmap.height);
            if (scale >= 1) {
                bitmap.close();
                return url;
            }
            const canvas = document.createElement('canvas');
            canvas.width = Math.round(bitmap.width * scale);
            canvas.height = Math.round(bitmap.height * scale);
            const context = canvas.getContext('2d');
            context.imageSmoothingQuality = 'high';
            context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
            bitmap.close();
            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', 0.9));
            return blob ? URL.createObjectURL(blob) : url;
        });
        queue = job.catch(() => {});
        made.set(key, job);
    }
    return made.get(key);
}

/** The thumbnail an element shows. */
function thumbnailOf(element) {
    return element instanceof HTMLImageElement
        ? element.getAttribute('src') ?? ''
        : /url\("?([^")]+)"?\)/.exec(element.style.backgroundImage)?.[1] ?? '';
}

async function sharpen(element) {
    const src = thumbnailOf(element);
    const full = fullPicture(src);
    if (!full || element.closest('.bg_example[animated="true"]')) {
        return;
    }
    const box = element.getBoundingClientRect();
    const width = box.width * (devicePixelRatio || 1);
    const height = box.height * (devicePixelRatio || 1);
    // an img with object-fit: cover is drawn at the larger of its two scales
    const scale = element instanceof HTMLImageElement
        ? Math.max(width / element.naturalWidth, height / element.naturalHeight)
        : Math.max(width / 160, height / 90);
    if (!(scale > SOFT)) {
        return;
    }
    try {
        const url = await sharpCopy(full, width, height);
        // SillyTavern may have moved the element on to another picture meanwhile
        if (thumbnailOf(element) === src) {
            element.style.setProperty('--dsc-sharp', `url("${url}")`);
            element.classList.add('dsc-sharp');
        }
    } catch {
        // the thumbnail stays
    }
}

const SELECTOR = 'img[src*="/thumbnail?type="], .bg_example .thumbnail-clipper';
/** element → the thumbnail it was last looked at for */
const checked = new WeakMap();

const seen = new IntersectionObserver((entries) => {
    for (const entry of entries) {
        if (entry.isIntersecting && entry.boundingClientRect.width > 0 && document.body.classList.contains('discord-theme')) {
            seen.unobserve(entry.target);
            sharpen(entry.target);
        }
    }
}, { rootMargin: '200px' });

/** Looks at an element again when it shows another thumbnail (or for the first time). */
function consider(element) {
    const src = thumbnailOf(element);
    if (checked.get(element) === src) {
        return;
    }
    checked.set(element, src);
    element.classList.remove('dsc-sharp');
    element.style.removeProperty('--dsc-sharp');
    seen.unobserve(element);
    if (element instanceof HTMLImageElement && !element.complete) {
        element.addEventListener('load', () => seen.observe(element), { once: true });
    } else {
        seen.observe(element);
    }
}

function watch(node) {
    if (node.matches(SELECTOR)) {
        consider(node);
    }
    node.querySelectorAll(SELECTOR).forEach(consider);
}

export function initSharp() {
    watch(document.body);
    new GatedObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'attributes') {
                if (/** @type {Element} */ (mutation.target).matches(SELECTOR)) {
                    consider(/** @type {Element} */ (mutation.target));
                }
            } else {
                for (const node of mutation.addedNodes) {
                    if (node instanceof Element) {
                        watch(node);
                    }
                }
            }
        }
    }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['src', 'style'] });
}
