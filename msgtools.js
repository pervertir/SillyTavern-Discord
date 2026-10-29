// Message tools the Discord way: right-click a message for Reply, Edit, Copy Text,
// Regenerate and Delete; while editing, Enter saves and Esc cancels (the hint under the box
// says so); and ↑ in an empty message box edits your last message.

import { isPinnedMessage, togglePinMessage } from './pins.js';
import { openPicker } from './reactions.js';
import { clickOption, openMenu, t } from './ui.js';
import { listen } from './life.js';

function messageData(mes) {
    return SillyTavern.getContext().chat[Number(mes.getAttribute('mesid'))];
}

function startEdit(mes) {
    /** @type {HTMLElement} */ (mes.querySelector('.mes_edit'))?.click();
    requestAnimationFrame(() => {
        const box = /** @type {HTMLTextAreaElement} */ (mes.querySelector('.edit_textarea'));
        box?.focus();
        box?.setSelectionRange(box.value.length, box.value.length);
    });
}

/** Quotes a message into the message box, as Discord's Reply does. */
function reply(mes) {
    const message = messageData(mes);
    const box = /** @type {HTMLTextAreaElement} */ (document.getElementById('send_textarea'));
    if (!message || !box) {
        return;
    }
    const text = String(message.mes ?? '').replace(/\s+/g, ' ').trim();
    const quote = `> **${message.name}:** ${text.length > 120 ? `${text.slice(0, 119)}…` : text}\n`;
    box.value = quote + box.value.replace(/^> .*\n/, '');
    box.dispatchEvent(new Event('input', { bubbles: true }));
    box.focus();
    box.setSelectionRange(box.value.length, box.value.length);
}

async function copyText(mes) {
    const message = messageData(mes);
    try {
        await navigator.clipboard.writeText(String(message?.mes ?? ''));
        toastr.success(t('Copied to clipboard'));
    } catch {
        toastr.error(t('Could not copy'));
    }
}

async function remove(mes) {
    const { deleteMessage } = SillyTavern.getContext();
    await deleteMessage(Number(mes.getAttribute('mesid')), undefined, true);
}

function openMessageMenu(mes, at) {
    const isLast = mes.classList.contains('last_mes');
    const isUser = mes.getAttribute('is_user') === 'true';
    const items = [
        { label: 'Add Reaction', icon: 'reaction', run: () => openPicker(Number(mes.getAttribute('mesid')), /** @type {HTMLElement} */ (mes.querySelector('.mes_block') ?? mes)) },
        { label: 'Reply', icon: 'reply', run: () => reply(mes) },
        { label: 'Edit Message', icon: 'edit', run: () => startEdit(mes) },
        { label: 'Copy Text', icon: 'copy', run: () => copyText(mes) },
        {
            label: isPinnedMessage(SillyTavern.getContext().chat[Number(mes.getAttribute('mesid'))]) ? 'Unpin Message' : 'Pin Message',
            icon: 'pin',
            run: () => togglePinMessage(Number(mes.getAttribute('mesid'))),
        },
    ];
    if (isLast && !isUser) {
        items.push({ label: 'Regenerate', icon: 'refresh', run: () => clickOption('option_regenerate') });
        items.push({ label: 'Continue', icon: 'send', run: () => clickOption('option_continue') });
    }
    items.push('separator', { label: 'Delete Message', icon: 'trash', danger: true, run: () => remove(mes) });
    openMenu(/** @type {HTMLElement} */ (mes.querySelector('.mes_block') ?? mes), items, at);
}

export function initMessageTools() {
    const chat = document.getElementById('chat');
    const on = () => document.body.classList.contains('discord-theme');

    listen(chat, 'contextmenu', (event) => {
        const target = /** @type {HTMLElement} */ (event.target);
        const mes = target.closest('.mes');
        // leave the browser's menu for text fields and links
        if (!on() || !mes || target.closest('textarea, input, a') || mes.querySelector('.edit_textarea')) {
            return;
        }
        event.preventDefault();
        openMessageMenu(mes, { x: event.clientX, y: event.clientY });
    });

    // editing: Enter saves, Shift+Enter is a new line, Esc cancels
    listen(chat, 'keydown', (event) => {
        const box = /** @type {HTMLElement} */ (event.target);
        if (!on() || !box.classList?.contains('edit_textarea') || event.isComposing) {
            return;
        }
        const mes = box.closest('.mes');
        if (event.key === 'Enter' && !event.shiftKey && !event.ctrlKey && !event.metaKey && !event.altKey) {
            event.preventDefault();
            event.stopPropagation();
            /** @type {HTMLElement} */ (mes?.querySelector('.mes_edit_done'))?.click();
        } else if (event.key === 'Escape') {
            event.preventDefault();
            event.stopPropagation();
            /** @type {HTMLElement} */ (mes?.querySelector('.mes_edit_cancel'))?.click();
        }
    }, true);

    // ↑ in an empty message box edits your last message
    listen(document.getElementById('send_textarea'), 'keydown', (event) => {
        const box = /** @type {HTMLTextAreaElement} */ (event.target);
        if (!on() || event.key !== 'ArrowUp' || box.value || event.shiftKey || event.altKey || event.ctrlKey || event.metaKey) {
            return;
        }
        const mine = [...chat.querySelectorAll(':scope > .mes[is_user="true"]')].pop();
        if (mine) {
            // SillyTavern's own ↑ edits the very last message; Discord edits yours
            event.preventDefault();
            event.stopPropagation();
            startEdit(mine);
        }
    });
}
