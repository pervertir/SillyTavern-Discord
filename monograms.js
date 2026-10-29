// Discord shows a colored default avatar wherever someone has no picture. SillyTavern copies
// its default pictures into new characters and personas, so a placeholder is found by how it
// looks: a tiny version of the picture is compared with a tiny version of the defaults.

import { getColorIndex, getInitials } from './ui.js';
import { GatedObserver, onEvent } from './life.js';

const DEFAULT_PICTURES = ['img/ai4.png', 'img/user-default.png'];
const SIZE = 12;
/** Average difference per color channel (0-255) under which two pictures count as the same */
const THRESHOLD = 16;

/** @type {Promise<Uint8ClampedArray[]>|null} */
let defaultSignatures = null;
/** @type {Map<string, Promise<boolean>>} */
const verdicts = new Map();

/** The picture's centre square, shrunk to a few pixels. */
async function signature(src) {
    const img = new Image();
    img.decoding = 'async';
    img.src = src;
    await img.decode();
    const side = Math.min(img.naturalWidth, img.naturalHeight);
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = SIZE;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    context.drawImage(img, (img.naturalWidth - side) / 2, (img.naturalHeight - side) / 2, side, side, 0, 0, SIZE, SIZE);
    return context.getImageData(0, 0, SIZE, SIZE).data;
}

function difference(a, b) {
    let total = 0;
    for (let i = 0; i < a.length; i += 4) {
        total += Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]);
    }
    return total / (a.length / 4 * 3);
}

/** Whether a picture is one of SillyTavern's defaults (or a copy of one). */
export function isPlaceholder(src) {
    if (!src) {
        return Promise.resolve(true);
    }
    if (!verdicts.has(src)) {
        defaultSignatures ??= Promise.all(DEFAULT_PICTURES.map(signature)).catch(() => []);
        verdicts.set(src, (async () => {
            if (DEFAULT_PICTURES.some(path => src.endsWith(path))) {
                return true;
            }
            try {
                const [mine, defaults] = await Promise.all([signature(src), defaultSignatures]);
                return defaults.some(known => difference(mine, known) < THRESHOLD);
            } catch {
                return false;
            }
        })());
    }
    return verdicts.get(src);
}

/** Puts a default avatar over a placeholder picture (the picture stays, hidden, for SillyTavern). */
async function monogramize(img, name) {
    const holder = img?.parentElement;
    if (!holder) {
        return;
    }
    const src = img.getAttribute('src') ?? '';
    if (holder.dataset.dscMonoFor === src && holder.dataset.dscMonoName === name) {
        return;
    }
    holder.dataset.dscMonoFor = src;
    holder.dataset.dscMonoName = name;
    const placeholder = await isPlaceholder(src);
    // the picture may have changed while this was being worked out
    if ((img.getAttribute('src') ?? '') !== src) {
        return;
    }
    let mark = holder.querySelector(':scope > .dsc-mono-mark');
    if (!placeholder) {
        holder.classList.remove('dsc-mono');
        mark?.remove();
        return;
    }
    if (!mark) {
        mark = document.createElement('span');
        mark.className = 'dsc-monogram dsc-mono-mark';
        mark.setAttribute('aria-hidden', 'true');
        holder.append(mark);
    }
    mark.textContent = getInitials(name);
    mark.dataset.dscColor = String(getColorIndex(name));
    holder.classList.add('dsc-mono');
}

/**
 * Default avatars on every placeholder picture under a root.
 * @param {ParentNode} root
 * @param {string} imgSelector
 * @param {(img: HTMLImageElement) => string} nameOf
 */
export function monogramizeAll(root, imgSelector, nameOf) {
    root?.querySelectorAll(imgSelector).forEach((img) => {
        monogramize(/** @type {HTMLImageElement} */ (img), nameOf(/** @type {HTMLImageElement} */ (img)) || '');
    });
}

function messageName(img) {
    return img.closest('.mes')?.getAttribute('ch_name') ?? '';
}

function rowName(img) {
    return img.closest('.character_select, .group_select, .avatar-container')?.querySelector('.ch_name')?.textContent?.trim() ?? '';
}

function monogramizeMessages() {
    monogramizeAll(document.getElementById('chat'), '.mes .avatar img', messageName);
}

export function initMonograms() {
    const { eventTypes } = SillyTavern.getContext();
    const one = (mesId) => {
        const mes = document.querySelector(`#chat .mes[mesid="${Number(mesId)}"]`);
        monogramizeAll(mes, '.avatar img', messageName);
    };
    const later = () => setTimeout(monogramizeMessages, 0);
    onEvent(eventTypes.CHARACTER_MESSAGE_RENDERED, one);
    onEvent(eventTypes.USER_MESSAGE_RENDERED, one);
    onEvent(eventTypes.CHAT_CHANGED, later);
    onEvent(eventTypes.MORE_MESSAGES_LOADED, later);
    onEvent(eventTypes.PERSONA_CHANGED, later);

    // the character list
    const people = () => monogramizeAll(document.getElementById('rm_print_characters_block'), '.avatar img', rowName);
    onEvent(eventTypes.CHARACTER_PAGE_LOADED, () => setTimeout(people, 0));
    people();

    // personas: SillyTavern redraws the list without an event, so watch the list itself
    const profiles = document.getElementById('user_avatar_block');
    if (profiles) {
        const run = () => monogramizeAll(profiles, '.avatar img', rowName);
        new GatedObserver(run).observe(profiles, { childList: true });
        run();
    }
    later();
}
