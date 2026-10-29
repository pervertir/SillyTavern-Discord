// Reactions, as in Discord: a smiley in the hover bar (and "Add Reaction" in the message menu)
// opens a small emoji picker; reactions show as pills under the message, and a click on a
// pill adds or takes back yours. They're saved in the message's extra data, so they survive
// reloads and never reach the prompt.

import { context, shieldFromOutsideClose, t } from './ui.js';

const PICKER_ID = 'dsc-react-picker';
const RECENT_KEY = 'dsc-recent-reactions';

/** Discord's quick reactions, then a broad everyday set */
const QUICK = ['👍', '❤️', '😂', '😮', '😢', '🔥'];
const EMOJI = [
    '😀', '😁', '😂', '🤣', '😊', '😇', '🙂', '😉', '😍', '🥰', '😘', '😋', '😜', '🤪', '🤗', '🤔',
    '🤨', '😐', '😑', '🙄', '😏', '😬', '😌', '😴', '🤤', '😷', '🥵', '🥶', '😵', '🤯', '🥳', '😎',
    '🤓', '😕', '😟', '😮', '😲', '😳', '🥺', '😨', '😰', '😢', '😭', '😱', '😤', '😡', '🤬', '💀',
    '👍', '👎', '👏', '🙌', '🙏', '🤝', '💪', '👀', '👋', '✌️', '🤞', '👌', '❤️', '🧡', '💛', '💚',
    '💙', '💜', '🖤', '💔', '💯', '🔥', '✨', '⭐', '🎉', '🎊', '💤', '💢', '💬', '❓', '❗', '✅',
    '❌', '☕', '🍵', '🍕', '🍰', '🌹', '🌸', '🐱', '🐶', '🌙', '☀️', '🌧️',
];

let editingMesId = null;

function getRecent() {
    try {
        return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]').slice(0, 6);
    } catch {
        return [];
    }
}

function remember(emoji) {
    try {
        localStorage.setItem(RECENT_KEY, JSON.stringify([emoji, ...getRecent().filter(x => x !== emoji)].slice(0, 6)));
    } catch {
        // storage can be refused
    }
}

function reactionsOf(message) {
    return message?.extra?.dsc_reactions ?? {};
}

/** Adds your reaction, or takes it back if it's there. */
async function toggle(mesId, emoji) {
    const context = SillyTavern.getContext();
    const message = context.chat[mesId];
    if (!message) {
        return;
    }
    message.extra ??= {};
    const all = { ...(message.extra.dsc_reactions ?? {}) };
    const entry = all[emoji] ?? { count: 0, me: false };
    if (entry.me) {
        entry.count = Math.max(0, entry.count - 1);
        entry.me = false;
    } else {
        entry.count += 1;
        entry.me = true;
        remember(emoji);
    }
    if (entry.count) {
        all[emoji] = entry;
    } else {
        delete all[emoji];
    }
    message.extra.dsc_reactions = all;
    renderReactions(mesId);
    await context.saveChat();
}

/** The pills under a message. */
export function renderReactions(mesId, mes = document.querySelector(`#chat > .mes[mesid="${Number(mesId)}"]`)) {
    const message = context().chat[Number(mesId)];
    const block = mes?.querySelector('.mes_block');
    if (!block) {
        return;
    }
    block.querySelector(':scope > .dsc-reactions')?.remove();
    const entries = Object.entries(reactionsOf(message));
    if (!entries.length) {
        return;
    }
    const row = document.createElement('div');
    row.className = 'dsc-reactions';
    for (const [emoji, { count, me }] of entries) {
        const pill = document.createElement('button');
        pill.type = 'button';
        pill.className = 'dsc-reaction';
        pill.classList.toggle('dsc-mine', !!me);
        pill.setAttribute('aria-pressed', String(!!me));
        pill.dataset.dscTip = me ? t('You reacted') : t('Click to react');
        const glyph = document.createElement('span');
        glyph.className = 'dsc-reaction-emoji';
        glyph.textContent = emoji;
        const number = document.createElement('span');
        number.className = 'dsc-reaction-count';
        number.textContent = String(count);
        pill.append(glyph, number);
        pill.addEventListener('click', () => toggle(Number(mesId), emoji));
        row.append(pill);
    }
    const add = document.createElement('button');
    add.type = 'button';
    add.className = 'dsc-reaction dsc-reaction-add';
    add.setAttribute('aria-label', t('Add Reaction'));
    add.dataset.dscTip = t('Add Reaction');
    add.addEventListener('click', event => openPicker(Number(mesId), /** @type {HTMLElement} */ (event.currentTarget)));
    row.append(add);
    // after the text and any pictures, before the swipe pager
    block.append(row);
}

/* ---------- the picker ---------- */

function closePicker() {
    document.getElementById(PICKER_ID)?.remove();
    editingMesId = null;
}

/** Opens the emoji picker by a button, for one message. */
export function openPicker(mesId, anchor) {
    closePicker();
    editingMesId = mesId;
    const picker = document.createElement('div');
    picker.id = PICKER_ID;
    picker.setAttribute('role', 'dialog');
    picker.setAttribute('aria-label', t('Add Reaction'));
    const section = (title, list) => {
        const heading = document.createElement('h3');
        heading.textContent = t(title);
        const grid = document.createElement('div');
        grid.className = 'dsc-react-grid';
        for (const emoji of list) {
            const cell = document.createElement('button');
            cell.type = 'button';
            cell.textContent = emoji;
            cell.addEventListener('click', () => {
                closePicker();
                toggle(mesId, emoji);
            });
            grid.append(cell);
        }
        return [heading, grid];
    };
    const recent = getRecent();
    picker.append(
        ...section('Frequently Used', recent.length ? [...new Set([...recent, ...QUICK])].slice(0, 8) : QUICK),
        ...section('People and More', EMOJI),
    );
    shieldFromOutsideClose(picker);
    document.body.append(picker);
    const box = anchor.getBoundingClientRect();
    const own = picker.getBoundingClientRect();
    const left = Math.max(8, Math.min(box.right - own.width, window.innerWidth - own.width - 8));
    const top = box.top - own.height - 8 > 8 ? box.top - own.height - 8 : Math.min(window.innerHeight - own.height - 8, box.bottom + 8);
    picker.style.left = `${Math.round(left)}px`;
    picker.style.top = `${Math.round(top)}px`;
    picker.querySelector('button')?.focus();
}

/** The hover bar's Add Reaction button, on each message. */
function addButton(mes) {
    const bar = mes.querySelector('.mes_buttons');
    if (!bar || bar.querySelector('.dsc-react-button')) {
        return;
    }
    const button = document.createElement('div');
    button.className = 'mes_button dsc-react-button interactable';
    button.title = t('Add Reaction');
    button.tabIndex = 0;
    button.addEventListener('click', (event) => {
        event.stopPropagation();
        openPicker(Number(mes.getAttribute('mesid')), button);
    });
    bar.prepend(button);
}

function renderAll() {
    document.querySelectorAll('#chat > .mes').forEach((mes) => {
        addButton(mes);
        renderReactions(mes.getAttribute('mesid'), mes);
    });
}

export function initReactions() {
    const { eventSource, eventTypes } = SillyTavern.getContext();
    const one = mesId => setTimeout(() => {
        const mes = document.querySelector(`#chat > .mes[mesid="${Number(mesId)}"]`);
        if (mes) {
            addButton(mes);
            renderReactions(mesId);
        }
    }, 0);
    for (const type of [eventTypes.USER_MESSAGE_RENDERED, eventTypes.CHARACTER_MESSAGE_RENDERED, eventTypes.MESSAGE_UPDATED, eventTypes.MESSAGE_EDITED, eventTypes.MESSAGE_SWIPED]) {
        eventSource.on(type, one);
    }
    for (const type of [eventTypes.CHAT_CHANGED, eventTypes.MORE_MESSAGES_LOADED, eventTypes.MESSAGE_DELETED]) {
        eventSource.on(type, () => setTimeout(renderAll, 0));
    }
    document.addEventListener('pointerdown', (event) => {
        const picker = document.getElementById(PICKER_ID);
        if (picker && !picker.contains(/** @type {Node} */ (event.target)) && !(/** @type {HTMLElement} */ (event.target)).closest('.dsc-react-button, .dsc-reaction-add')) {
            closePicker();
        }
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && document.getElementById(PICKER_ID)) {
            event.preventDefault();
            event.stopPropagation();
            closePicker();
        }
    }, true);
    setTimeout(renderAll, 0);
}
