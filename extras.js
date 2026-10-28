// Discord's markdown extras on top of SillyTavern's formatting: ||spoilers|| (hidden until
// clicked) and "-# " subtext lines (small, muted). SillyTavern leaves both as plain text, so
// they're found in the formatted message's text, never inside code.

const SPOILER = /\|\|([^|\n](?:[^\n]*?[^|\n])?)\|\|/g;

/** Text nodes of a message, outside code and outside spoilers already made. */
function textNodes(container) {
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
        acceptNode: node => node.parentElement?.closest('code, pre, .dsc-spoiler, .dsc-embeds, .dsc-reactions') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT,
    });
    const nodes = [];
    while (walker.nextNode()) {
        nodes.push(/** @type {Text} */ (walker.currentNode));
    }
    return nodes;
}

function spoiler(content) {
    const span = document.createElement('span');
    span.className = 'dsc-spoiler';
    span.setAttribute('role', 'button');
    span.setAttribute('aria-label', 'Spoiler');
    span.tabIndex = 0;
    const inner = document.createElement('span');
    inner.className = 'dsc-spoiler-text';
    inner.append(...content);
    span.append(inner);
    return span;
}

/** ||text|| within one stretch of text, and across formatting (||a *b* c||) in one block. */
function makeSpoilers(container) {
    for (const node of textNodes(container)) {
        if (!node.nodeValue.includes('||')) {
            continue;
        }
        SPOILER.lastIndex = 0;
        if (!SPOILER.test(node.nodeValue)) {
            continue;
        }
        const fragment = document.createDocumentFragment();
        let last = 0;
        node.nodeValue.replace(SPOILER, (match, inner, offset) => {
            fragment.append(node.nodeValue.slice(last, offset), spoiler([inner]));
            last = offset + match.length;
            return match;
        });
        fragment.append(node.nodeValue.slice(last));
        node.replaceWith(fragment);
    }
    // a spoiler around formatting: "||" closes in a later text node of the same parent
    for (const node of textNodes(container)) {
        const start = node.nodeValue.indexOf('||');
        if (start < 0 || !node.parentNode) {
            continue;
        }
        let end = node.nextSibling;
        while (end && !(end.nodeType === Node.TEXT_NODE && end.nodeValue.includes('||')) && end.nodeName !== 'BR') {
            end = end.nextSibling;
        }
        if (!end || end.nodeName === 'BR') {
            continue;
        }
        const close = end.nodeValue.indexOf('||');
        const before = node.nodeValue.slice(0, start);
        const firstInner = node.nodeValue.slice(start + 2);
        const lastInner = end.nodeValue.slice(0, close);
        const after = end.nodeValue.slice(close + 2);
        const middle = [];
        for (let sibling = node.nextSibling; sibling && sibling !== end; sibling = sibling.nextSibling) {
            middle.push(sibling);
        }
        const span = spoiler([firstInner, ...middle, lastInner]);
        node.nodeValue = before;
        node.after(span);
        end.nodeValue = after;
    }
}

/** "-# text" at the start of a line: Discord's small, muted subtext. */
function makeSubtext(container) {
    for (const node of textNodes(container)) {
        const atLineStart = !node.previousSibling || node.previousSibling.nodeName === 'BR';
        if (!atLineStart || !/^\s*-# /.test(node.nodeValue)) {
            continue;
        }
        const span = document.createElement('span');
        span.className = 'dsc-subtext';
        node.nodeValue = node.nodeValue.replace(/^\s*-# /, '');
        const line = [];
        for (let sibling = /** @type {ChildNode} */ (node); sibling && sibling.nodeName !== 'BR'; sibling = sibling.nextSibling) {
            line.push(sibling);
        }
        node.before(span);
        span.append(...line);
    }
}

/** Applies the extras to formatted message text (a .mes_text or one split part). */
export function applyExtras(container) {
    if (!document.body.classList.contains('discord-theme') || container.closest('.mes')?.querySelector('.edit_textarea')) {
        return;
    }
    makeSpoilers(container);
    makeSubtext(container);
}

export function initExtras() {
    const reveal = (target) => {
        const element = /** @type {HTMLElement} */ (target).closest?.('#chat .dsc-spoiler');
        if (element && !element.classList.contains('dsc-revealed')) {
            element.classList.add('dsc-revealed');
            element.removeAttribute('role');
            element.removeAttribute('tabindex');
            element.removeAttribute('aria-label');
            return true;
        }
        return false;
    };
    document.addEventListener('click', (event) => {
        if (reveal(event.target)) {
            // the first click reveals; it doesn't follow a link or open a picture under it
            event.preventDefault();
            event.stopPropagation();
        }
    }, true);
    document.addEventListener('keydown', (event) => {
        if ((event.key === 'Enter' || event.key === ' ') && reveal(event.target)) {
            event.preventDefault();
        }
    });
}
