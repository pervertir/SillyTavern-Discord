// Pictures, videos and files attached to messages (SillyTavern's own media and file blocks,
// including generated images) look and act like Discord attachments: pictures open in the
// theme's viewer, with arrows between a message's pictures, and files show as Discord's file
// cards with a download button. SillyTavern's own buttons (zoom, caption, delete, view
// contents, remove) stay, in Discord's small hover toolbar.

import { openViewer } from './embeds.js';
import { messageOf, t } from './ui.js';
import { GatedObserver, listen, onEvent } from './life.js';

/** The message's pictures, for the viewer. */
function pictures(mes) {
    const message = messageOf(mes);
    const media = Array.isArray(message?.extra?.media) ? message.extra.media : [];
    return media.map((item, index) => ({ item, index })).filter(({ item }) => !item.type || item.type === 'image')
        .map(({ item, index }) => ({ url: item.url, alt: item.title || '', index }));
}

/** A download button on each file card, as Discord's. */
function addDownloads(mes) {
    const message = messageOf(mes);
    const files = Array.isArray(message?.extra?.files) ? message.extra.files : [];
    for (const card of mes.querySelectorAll('.mes_file_container')) {
        const file = files[Number(card.getAttribute('data-index'))];
        if (!file?.url || card.querySelector('.dsc-file-download')) {
            continue;
        }
        const link = document.createElement('a');
        link.className = 'dsc-file-download';
        link.href = file.url;
        link.download = file.name || '';
        link.title = t('Download');
        link.setAttribute('aria-label', t('Download'));
        card.querySelector('.mes_file_open')?.before(link);
    }
}

function refresh(mes) {
    if (mes) {
        addDownloads(mes);
    }
}

export function initAttachments() {
    const chat = document.getElementById('chat');
    // a click on a picture opens the theme's viewer instead of SillyTavern's zoom popup (the
    // magnifier in the toolbar still opens that one)
    listen(chat, 'click', (event) => {
        const img = /** @type {HTMLElement} */ (event.target).closest?.('.mes_img');
        if (!img || !document.body.classList.contains('discord-theme') || img.classList.contains('error')) {
            return;
        }
        const mes = img.closest('.mes');
        const list = pictures(mes);
        const index = Number(img.closest('.mes_img_container')?.getAttribute('data-index'));
        if (!list.length) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        openViewer(list, Math.max(0, list.findIndex(x => x.index === index)));
    }, true);
    // the file name opens its contents, as clicking a file's name does in Discord
    listen(chat, 'click', (event) => {
        const name = /** @type {HTMLElement} */ (event.target).closest?.('.mes_file_name');
        if (name && document.body.classList.contains('discord-theme')) {
            /** @type {HTMLElement} */ (name.closest('.mes_file_container')?.querySelector('.mes_file_open'))?.click();
        }
    });
    const { eventTypes } = SillyTavern.getContext();
    const one = mesId => setTimeout(() => refresh(document.querySelector(`#chat > .mes[mesid="${Number(mesId)}"]`)), 0);
    for (const type of [eventTypes.USER_MESSAGE_RENDERED, eventTypes.CHARACTER_MESSAGE_RENDERED, eventTypes.MESSAGE_UPDATED, eventTypes.MESSAGE_EDITED, eventTypes.MESSAGE_SWIPED, eventTypes.MESSAGE_FILE_EMBEDDED].filter(Boolean)) {
        onEvent(type, one);
    }
    const all = () => setTimeout(() => document.querySelectorAll('#chat > .mes').forEach(refresh), 0);
    for (const type of [eventTypes.CHAT_CHANGED, eventTypes.MORE_MESSAGES_LOADED]) {
        onEvent(type, all);
    }
    // file cards are also redrawn on their own (attaching or removing a file), and messages
    // can arrive without a rendered event
    if (chat) {
        new GatedObserver((records) => {
            for (const record of records) {
                const target = /** @type {HTMLElement} */ (record.target);
                if (target.classList?.contains('mes_file_wrapper')) {
                    refresh(target.closest('.mes'));
                } else if (target === chat) {
                    // whole messages added, already carrying their files
                    record.addedNodes.forEach(node => node instanceof HTMLElement && node.classList.contains('mes') && node.querySelector('.mes_file_container') && refresh(node));
                }
            }
        }).observe(chat, { childList: true, subtree: true });
    }
    all();
}
