// Pinned messages, as in Discord: "Pin Message" in a message's menu, and the header's pin
// icon opens the Pinned Messages list (newest pin first) with Jump and Unpin. Pins are kept in
// the message's extra data, so they survive reloads and never reach the prompt. The list's
// footer keeps "Pin Chat" (pinning the conversation to the top of the list) within reach.

import { avatarFor, jump, plainText } from './search.js';
import { context, escapeHtml, iconButton, shieldFromOutsideClose, t } from './ui.js';
import { monogramizeAll } from './monograms.js';

const LIST_ID = 'dsc-pins';

let actions = { isChatPinned: () => false, toggleChatPin: () => {} };

export function isPinnedMessage(message) {
    return !!message?.extra?.dsc_pinned;
}

/** Pins or unpins a message. */
export async function togglePinMessage(mesId) {
    const context = SillyTavern.getContext();
    const message = context.chat[Number(mesId)];
    if (!message) {
        return;
    }
    message.extra ??= {};
    if (message.extra.dsc_pinned) {
        delete message.extra.dsc_pinned;
    } else {
        message.extra.dsc_pinned = Date.now();
    }
    markPinned(Number(mesId));
    renderList();
    await context.saveChat();
}

/** A small pin by the time of a pinned message. */
function markPinned(mesId) {
    const mes = document.querySelector(`#chat > .mes[mesid="${mesId}"]`);
    if (mes) {
        mes.classList.toggle('dsc-pinned', isPinnedMessage(context().chat[mesId]));
    }
}

function markAll() {
    const { chat } = context();
    document.querySelectorAll('#chat > .mes').forEach((mes) => {
        mes.classList.toggle('dsc-pinned', isPinnedMessage(chat[Number(mes.getAttribute('mesid'))]));
    });
}

export function closePins() {
    document.getElementById(LIST_ID)?.remove();
    document.querySelector('#dsc-head .dsc-tool-pin')?.classList.remove('dsc-open');
}

function renderList() {
    const list = document.getElementById(LIST_ID);
    if (!list) {
        return;
    }
    const { chat, timestampToMoment } = SillyTavern.getContext();
    const pinned = chat.map((message, index) => ({ message, index })).filter(x => isPinnedMessage(x.message))
        .sort((a, b) => Number(b.message.extra.dsc_pinned) - Number(a.message.extra.dsc_pinned));

    const head = document.createElement('div');
    head.className = 'dsc-pins-head';
    const title = document.createElement('h2');
    title.textContent = t('Pinned Messages');
    const close = iconButton('dsc-pins-close', t('Close'), 'close', 18);
    close.addEventListener('click', closePins);
    head.append(title, close);

    const body = document.createElement('div');
    body.className = 'dsc-pins-list';
    if (!pinned.length) {
        const empty = document.createElement('div');
        empty.className = 'dsc-pins-empty';
        empty.innerHTML = `<div class="dsc-pins-art"></div><p>${escapeHtml(t('This chat doesn\'t have any pinned messages… yet.'))}</p><small>${escapeHtml(t('Hover a message, open its menu (⋯) and choose Pin Message.'))}</small>`;
        body.append(empty);
    }
    for (const { message, index } of pinned) {
        const card = document.createElement('article');
        card.className = 'dsc-search-result dsc-pin-card';
        const picture = document.createElement('span');
        picture.className = 'dsc-avatar';
        picture.dataset.name = message.name ?? '';
        const img = document.createElement('img');
        img.alt = '';
        img.loading = 'lazy';
        img.src = avatarFor(message);
        picture.append(img);
        const main = document.createElement('div');
        main.className = 'dsc-search-body';
        const top = document.createElement('div');
        top.className = 'dsc-search-top';
        const name = document.createElement('span');
        name.className = 'dsc-search-name';
        name.textContent = message.name ?? '';
        const when = document.createElement('time');
        const sent = message.send_date ? timestampToMoment(message.send_date) : null;
        when.textContent = sent?.isValid?.() ? sent.format('l LT') : '';
        top.append(name, when);
        const text = document.createElement('div');
        text.className = 'dsc-search-text dsc-pin-text';
        text.textContent = plainText(message);
        main.append(top, text);
        const tools = document.createElement('div');
        tools.className = 'dsc-pin-tools';
        const go = document.createElement('button');
        go.type = 'button';
        go.className = 'dsc-search-jump';
        go.textContent = t('Jump');
        go.addEventListener('click', () => {
            closePins();
            jump(index);
        });
        const unpin = iconButton('dsc-pin-remove', t('Unpin'), 'close', 14);
        unpin.addEventListener('click', () => togglePinMessage(index));
        tools.append(go, unpin);
        card.append(picture, main, tools);
        body.append(card);
    }

    const foot = document.createElement('div');
    foot.className = 'dsc-pins-foot';
    const chatPin = document.createElement('button');
    chatPin.type = 'button';
    chatPin.textContent = t(actions.isChatPinned() ? 'Unpin this chat from the top of your list' : 'Pin this chat to the top of your list');
    chatPin.addEventListener('click', () => {
        actions.toggleChatPin();
        renderList();
    });
    foot.append(chatPin);
    list.replaceChildren(head, body, foot);
    monogramizeAll(list, '.dsc-avatar img', img => img.parentElement?.dataset.name ?? '');
}

/** Opens or closes the Pinned Messages list under the header's pin icon. */
export function togglePins(anchor) {
    if (document.getElementById(LIST_ID)) {
        closePins();
        return;
    }
    const list = document.createElement('section');
    list.id = LIST_ID;
    list.setAttribute('role', 'dialog');
    list.setAttribute('aria-label', t('Pinned Messages'));
    shieldFromOutsideClose(list);
    document.body.append(list);
    renderList();
    anchor?.classList.add('dsc-open');
    const box = anchor?.getBoundingClientRect();
    if (box) {
        const width = list.getBoundingClientRect().width;
        list.style.top = `${Math.round(box.bottom + 8)}px`;
        list.style.left = `${Math.round(Math.max(8, Math.min(box.right - width, window.innerWidth - width - 8)))}px`;
    }
}

/**
 * @param {object} options
 * @param {() => boolean} options.isChatPinned
 * @param {() => void} options.toggleChatPin
 */
export function initPins(options) {
    actions = { ...actions, ...options };
    const { eventSource, eventTypes } = SillyTavern.getContext();
    eventSource.on(eventTypes.CHAT_CHANGED, () => {
        closePins();
        setTimeout(markAll, 0);
    });
    for (const type of [eventTypes.MORE_MESSAGES_LOADED, eventTypes.MESSAGE_DELETED]) {
        eventSource.on(type, () => setTimeout(() => {
            markAll();
            renderList();
        }, 0));
    }
    for (const type of [eventTypes.USER_MESSAGE_RENDERED, eventTypes.CHARACTER_MESSAGE_RENDERED, eventTypes.MESSAGE_UPDATED, eventTypes.MESSAGE_EDITED]) {
        eventSource.on(type, mesId => setTimeout(() => markPinned(Number(mesId)), 0));
    }
    document.addEventListener('pointerdown', (event) => {
        const list = document.getElementById(LIST_ID);
        const target = /** @type {HTMLElement} */ (event.target);
        if (list && !list.contains(target) && !target.closest('.dsc-tool-pin')) {
            closePins();
        }
    }, true);
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && document.getElementById(LIST_ID)) {
            event.preventDefault();
            event.stopPropagation();
            closePins();
        }
    }, true);
    setTimeout(markAll, 0);
}
