// Finds image links in a chat message's raw markdown, the way Discord turns a pasted image
// link into an image. Self-contained and dependency-free (no DOM, no SillyTavern), so any
// theme can use the same rules.
//
//   findImageLinks(text) => [{ url, alt, markdown }]
//   isImageUrl(url) => boolean
//   isOnlyImages(text) => boolean   (the text is nothing but image links: hide the link text)
//   imagesLabel(text) => '' | 'Image' | 'N Images'   (for previews of picture-only messages)
//
// Matches markdown images ![alt](url "title"), HTML <img src="http(s)…">, and bare http(s)
// links ending in png, jpg, jpeg, gif, webp, avif, bmp or apng (query strings and fragments
// allowed, trailing sentence punctuation left out). Each URL once, in reading order; code
// spans and fences never count.

/** Image file endings Discord embeds, before any ?query or #hash */
const IMAGE_EXT = /\.(?:png|jpe?g|gif|webp|avif|bmp|apng)$/i;

/** http(s) links in plain text; stops at spaces, quotes, angle brackets and closing brackets */
const URL_IN_TEXT = /\bhttps?:\/\/[^\s<>"'`)\]]+/gi;

/** markdown image: ![alt](url "optional title") */
const MARKDOWN_IMAGE = /!\[([^\]]*)\]\(\s*<?(https?:\/\/[^\s)>]+)>?(?:\s+"[^"]*")?\s*\)/gi;

/** HTML image tag with an http(s) source */
const HTML_IMAGE = /<img\b[^>]*?\bsrc\s*=\s*["']?(https?:\/\/[^"'\s>]+)["']?[^>]*>/gi;

/** Trailing punctuation that ends a sentence rather than the link */
const TRAILING = /[.,;:!?]+$/;

/** Whether a link points at an image file (http or https only). */
export function isImageUrl(url) {
    let parsed;
    try {
        parsed = new URL(String(url));
    } catch {
        return false;
    }
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return false;
    }
    return IMAGE_EXT.test(decodeURIComponent(parsed.pathname));
}

/**
 * Every image link in the text, in order, each once: markdown images first in reading
 * order with their alt text, then bare links.
 * @param {string} text Raw message markdown
 * @returns {{url: string, alt: string, markdown: boolean}[]}
 */
export function findImageLinks(text) {
    const source = String(text ?? '');
    const found = [];
    const seen = new Set();
    // code spans and fences never embed
    const visible = source.replace(/```[\s\S]*?```|`[^`\n]*`/g, match => ' '.repeat(match.length));
    const markdownRanges = [];
    for (const match of visible.matchAll(HTML_IMAGE)) {
        const url = match[1];
        markdownRanges.push([match.index, match.index + match[0].length]);
        const alt = match[0].match(/\balt\s*=\s*["']([^"']*)["']/i)?.[1] ?? '';
        if (!seen.has(url)) {
            seen.add(url);
            found.push({ url, alt, markdown: true, at: match.index });
        }
    }
    for (const match of visible.matchAll(MARKDOWN_IMAGE)) {
        const url = match[2];
        markdownRanges.push([match.index, match.index + match[0].length]);
        if (isImageUrl(url) && !seen.has(url)) {
            seen.add(url);
            found.push({ url, alt: match[1].trim(), markdown: true, at: match.index });
        }
    }
    for (const match of visible.matchAll(URL_IN_TEXT)) {
        if (markdownRanges.some(([start, end]) => match.index >= start && match.index < end)) {
            continue;
        }
        // a link written as [text](url) keeps its own words; still embed the image it points at
        const url = match[0].replace(TRAILING, '');
        if (isImageUrl(url) && !seen.has(url)) {
            seen.add(url);
            found.push({ url, alt: '', markdown: false, at: match.index });
        }
    }
    return found.sort((a, b) => a.at - b.at).map(({ url, alt, markdown }) => ({ url, alt, markdown }));
}

/** Whether the text is only image links (and white space), so the link text can be hidden. */
export function isOnlyImages(text) {
    const source = String(text ?? '');
    const links = findImageLinks(source);
    if (!links.length) {
        return false;
    }
    let rest = source.replace(MARKDOWN_IMAGE, ' ').replace(HTML_IMAGE, ' ');
    for (const { url } of links) {
        rest = rest.split(url).join(' ');
    }
    return !rest.replace(/[<>]/g, '').trim();
}

/** "Image" or "N Images" for a message that is only pictures, else ''. */
export function imagesLabel(text) {
    if (!isOnlyImages(text)) {
        return '';
    }
    const count = findImageLinks(text).length;
    return count === 1 ? 'Image' : `${count} Images`;
}
