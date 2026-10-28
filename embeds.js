// Image links in messages show as pictures, the way Discord embeds a pasted image link: the
// whole picture at its own shape, at most 550×350, rounded, after the words, with a
// click-to-enlarge viewer. Links are found in the raw message (lib/image-links.js), because
// SillyTavern's "Forbid External Media" strips image tags before the message is drawn. This
// runs after SillyTavern's own formatter (on the whole message or each split part): it
// removes the link text, its anchor and any picture SillyTavern drew, hides what is left
// empty, and adds the pictures below. The theme's "Show image links as pictures" setting
// (on by default) decides, on its own, whether pictures show; off leaves SillyTavern's own
// handling. The shared rules are in /Volumes/980Pro/Workspace/AI/shared/image-embeds.md.

import { findImageLinks } from './lib/image-links.js';
import { shieldFromOutsideClose, t } from './ui.js';

let enabled = () => true;
/** a reply is being written: its message is left alone until it's done */
let generating = false;

/* ---------- the viewer ---------- */

function closeViewer() {
    document.getElementById('dsc-viewer')?.remove();
}

function openViewer(url, alt) {
    closeViewer();
    const viewer = document.createElement('div');
    viewer.id = 'dsc-viewer';
    viewer.setAttribute('role', 'dialog');
    viewer.setAttribute('aria-label', alt || t('Image'));
    const img = document.createElement('img');
    img.src = url;
    img.alt = alt;
    img.referrerPolicy = 'no-referrer';
    const open = document.createElement('a');
    open.href = url;
    open.target = '_blank';
    open.rel = 'noopener noreferrer';
    open.referrerPolicy = 'no-referrer';
    open.textContent = t('Open in Browser');
    viewer.append(img, open);
    viewer.addEventListener('click', (event) => {
        if (event.target === viewer) {
            closeViewer();
        }
    });
    shieldFromOutsideClose(viewer);
    document.body.append(viewer);
}

/* ---------- embeds ---------- */

function imageEmbed({ url, alt }) {
    const box = document.createElement('div');
    box.className = 'dsc-embed dsc-embed-loading';
    const img = document.createElement('img');
    img.alt = alt;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.referrerPolicy = 'no-referrer';
    img.addEventListener('load', () => {
        box.classList.remove('dsc-embed-loading');
        // the box takes the picture's own shape within the size limit (550×350 unless
        // customized), so nothing jumps afterwards
        const style = getComputedStyle(document.body);
        const maxW = parseFloat(style.getPropertyValue('--dsc-embed-w')) || 550;
        const maxH = parseFloat(style.getPropertyValue('--dsc-embed-h')) || 350;
        const scale = Math.min(1, maxW / img.naturalWidth, maxH / img.naturalHeight);
        box.style.width = `${Math.round(img.naturalWidth * scale)}px`;
        box.style.aspectRatio = `${img.naturalWidth} / ${img.naturalHeight}`;
    });
    img.addEventListener('error', () => {
        // a broken image falls back to its link
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = url;
        box.replaceWith(link);
    });
    img.addEventListener('click', () => openViewer(url, alt));
    img.src = url;
    box.append(img);
    return box;
}

/** Takes the link's own text out of the formatted words: text that is only the link, an
    anchor pointing at it, or a picture SillyTavern drew from it. */
function removeLinkText(container, url) {
    for (const element of container.querySelectorAll(`a[href="${CSS.escape(url)}"], img[src="${CSS.escape(url)}"]`)) {
        element.remove();
    }
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) {
        if (walker.currentNode.nodeValue.includes(url) && !walker.currentNode.parentElement?.closest('code, pre')) {
            nodes.push(walker.currentNode);
        }
    }
    for (const node of nodes) {
        // "the diagram: <link>." reads "the diagram."
        node.nodeValue = node.nodeValue.split(url).join('').replace(/\s+([.,;:!?])/g, '$1').replace(/[:;,]([.!?])/g, '$1');
    }
}

/** Hides paragraphs and line breaks the links left empty. */
function hideEmpty(container) {
    for (const block of container.querySelectorAll(':scope > p, :scope > div:not(.dsc-embeds):not(.dsc-part)')) {
        if (!block.textContent.trim() && !block.querySelector('img, video, iframe, code')) {
            block.classList.add('dsc-empty');
        }
    }
}

/**
 * Shows the pictures a piece of message text links to, after its words.
 * @param {HTMLElement} container The formatted text (a .mes_text, or one part of a split reply)
 * @param {string} raw The raw markdown it was formatted from
 */
export function embedImages(container, raw) {
    container.querySelectorAll(':scope > .dsc-embeds').forEach(x => x.remove());
    if (!enabled()) {
        return;
    }
    const links = findImageLinks(raw);
    if (!links.length) {
        return;
    }
    const holder = document.createElement('div');
    holder.className = 'dsc-embeds';
    for (const link of links) {
        removeLinkText(container, link.url);
        holder.append(imageEmbed(link));
    }
    hideEmpty(container);
    container.append(holder);
}

/** Embeds for a whole message that wasn't split. */
function embedMessage(mes) {
    const text = /** @type {HTMLElement} */ (mes.querySelector('.mes_text'));
    if (!text || text.dataset.dscParts || mes.querySelector('.edit_textarea')) {
        return;
    }
    if (generating && mes.classList.contains('last_mes')) {
        return;
    }
    const message = SillyTavern.getContext().chat[Number(mes.getAttribute('mesid'))];
    if (message) {
        embedImages(text, message.extra?.display_text || message.mes);
    }
}

export function embedAll() {
    document.querySelectorAll('#chat > .mes').forEach(mes => embedMessage(/** @type {HTMLElement} */ (mes)));
}

/** SillyTavern's "External media has been blocked" notice contradicts the picture the theme
    shows, so while pictures are on that one notice is cleared as it appears. */
function hideBlockedNotice() {
    const title = SillyTavern.getContext().translate('External media has been blocked');
    const watch = (container) => new MutationObserver(() => {
        if (!enabled()) {
            return;
        }
        for (const toast of container.querySelectorAll('.toast')) {
            if (toast.querySelector('.toast-title')?.textContent.trim() === title) {
                toast.remove();
            }
        }
    }).observe(container, { childList: true });
    const existing = document.getElementById('toast-container');
    if (existing) {
        watch(existing);
        return;
    }
    // toastr makes its container with the first toast; watch the page until then
    const wait = new MutationObserver(() => {
        const container = document.getElementById('toast-container');
        if (container) {
            wait.disconnect();
            watch(container);
            // the first toast came with the container
            for (const toast of container.querySelectorAll('.toast')) {
                if (enabled() && toast.querySelector('.toast-title')?.textContent.trim() === title) {
                    toast.remove();
                }
            }
        }
    });
    wait.observe(document.body, { childList: true });
}

/** @param {{enabled: () => boolean}} options enabled: the theme is on and \"Show image links as pictures\" is set */
export function initEmbeds(options) {
    enabled = options.enabled;
    const { eventSource, eventTypes } = SillyTavern.getContext();
    eventSource.on(eventTypes.GENERATION_STARTED, (type, params, dryRun) => {
        generating = !dryRun;
    });
    for (const type of [eventTypes.GENERATION_ENDED, eventTypes.GENERATION_STOPPED]) {
        eventSource.on(type, () => {
            generating = false;
        });
    }
    const one = mesId => setTimeout(() => {
        const mes = document.querySelector(`#chat > .mes[mesid="${Number(mesId)}"]`);
        if (mes) {
            embedMessage(/** @type {HTMLElement} */ (mes));
        }
    }, 0);
    for (const type of [eventTypes.USER_MESSAGE_RENDERED, eventTypes.CHARACTER_MESSAGE_RENDERED, eventTypes.MESSAGE_UPDATED, eventTypes.MESSAGE_EDITED, eventTypes.MESSAGE_SWIPED]) {
        eventSource.on(type, one);
    }
    for (const type of [eventTypes.CHAT_CHANGED, eventTypes.MORE_MESSAGES_LOADED]) {
        eventSource.on(type, () => setTimeout(embedAll, 0));
    }
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && document.getElementById('dsc-viewer')) {
            event.preventDefault();
            event.stopPropagation();
            closeViewer();
        }
    }, true);
    hideBlockedNotice();
    setTimeout(embedAll, 0);
}
