// Discord's message flow: a message from the same author within seven minutes joins the one
// before it without repeating the name and picture, a date line starts each new day, and
// times read "Today at 4:20 PM". Everything goes into attributes on SillyTavern's own message
// elements; CSS does the rest. Work happens on SillyTavern's message events, never on a
// watcher over the chat.

import { context, t } from './ui.js';
import { listen, onEvent } from './life.js';

const GROUP_GAP_MS = 7 * 60 * 1000;

let use24h = () => false;

/** The clock part of a time: 4:20 PM, or 16:20 with 24-hour time on. */
export function clock(time) {
    return time.format(use24h() ? 'HH:mm' : 'LT');
}

/** @param {() => boolean} fn */
export function setClock(fn) {
    use24h = fn;
}

/** Parsed send times, by their text: each message's time is read for itself and its neighbour */
const moments = new Map();

function momentOf(mes) {
    const { chat, timestampToMoment } = context();
    const message = chat[Number(mes.getAttribute('mesid'))];
    if (!message?.send_date) {
        return null;
    }
    const key = String(message.send_date);
    if (!moments.has(key)) {
        if (moments.size > 5000) {
            moments.clear();
        }
        const time = timestampToMoment(message.send_date);
        moments.set(key, time?.isValid?.() ? time : null);
    }
    return moments.get(key);
}

/** "Today at 4:20 PM", "Yesterday at 9:03 AM", or "10/21/2026 3:15 PM". */
function formatMessageTime(time) {
    const { timestampToMoment } = SillyTavern.getContext();
    const now = timestampToMoment(Date.now());
    if (time.isSame(now, 'day')) {
        return `${t('Today at')} ${clock(time)}`;
    }
    if (time.isSame(now.clone().subtract(1, 'day'), 'day')) {
        return `${t('Yesterday at')} ${clock(time)}`;
    }
    return `${time.format('L')} ${clock(time)}`;
}

/** A list time: the clock today, "Yesterday", the weekday this week, else the date. */
export function formatListTime(timestamp) {
    const { timestampToMoment } = SillyTavern.getContext();
    const time = timestampToMoment(timestamp);
    if (!time?.isValid?.()) {
        return '';
    }
    const now = timestampToMoment(Date.now());
    if (time.isSame(now, 'day')) {
        return clock(time);
    }
    if (time.isSame(now.clone().subtract(1, 'day'), 'day')) {
        return t('Yesterday');
    }
    return time.format('L');
}

function authorOf(mes) {
    return `${mes.getAttribute('is_user')}|${mes.getAttribute('ch_name')}`;
}

function isSystemNote(mes) {
    return mes.classList.contains('smallSysMes') || mes.getAttribute('is_system') === 'true';
}

function previousMessage(mes) {
    let node = mes.previousElementSibling;
    while (node && !node.classList.contains('mes')) {
        node = node.previousElementSibling;
    }
    return node;
}

/** Sets (or, with null, removes) a data attribute only when it changes: each write is a page
    change that SillyTavern's own page watchers react to, which adds up over a long chat. */
function setData(element, key, value) {
    if (!element) {
        return;
    }
    if (value === null) {
        if (key in element.dataset) {
            delete element.dataset[key];
        }
    } else if (element.dataset[key] !== value) {
        element.dataset[key] = value;
    }
}

function labelMessage(mes) {
    const time = momentOf(mes);
    const stamp = /** @type {HTMLElement} */ (mes.querySelector('.timestamp'));
    const previous = previousMessage(mes);
    const previousTime = previous ? momentOf(previous) : null;

    if (time) {
        setData(stamp, 'dscTime', formatMessageTime(time));
        setData(stamp, 'dscShort', clock(time));
        setData(stamp, 'dscTip', time.format('LLLL'));
        setData(mes, 'dscShort', clock(time));
    } else {
        setData(stamp, 'dscTime', null);
        setData(stamp, 'dscShort', null);
        setData(mes, 'dscShort', null);
    }

    const newDay = !!time && (!previousTime || !time.isSame(previousTime, 'day'));
    setData(mes, 'dscDay', newDay ? time.format('LL') : null);

    const continues = !!previous && !!time && !!previousTime && !newDay
        && !isSystemNote(mes) && !isSystemNote(previous)
        && authorOf(mes) === authorOf(previous)
        && Math.abs(time.diff(previousTime)) < GROUP_GAP_MS;
    mes.classList.toggle('dsc-cont', continues);
}

/** Labels one message (and the one after it, whose grouping depends on it), or the whole chat. */
export function labelMessages(mesId) {
    const chat = document.getElementById('chat');
    if (!chat) {
        return;
    }
    if (mesId !== undefined && mesId !== null && mesId !== '') {
        const mes = chat.querySelector(`:scope > .mes[mesid="${Number(mesId)}"]`);
        if (mes) {
            labelMessage(mes);
            const next = mes.nextElementSibling;
            if (next?.classList.contains('mes')) {
                labelMessage(next);
            }
        }
        return;
    }
    chat.querySelectorAll(':scope > .mes[mesid]').forEach(labelMessage);
}

/** Touch screens have no hover: a tap on a message shows its action bar, as a long press does on Discord mobile. */
function initTaps() {
    const chat = document.getElementById('chat');
    const touch = window.matchMedia('(hover: none)');
    listen(chat, 'click', (event) => {
        if (!touch.matches || !document.body.classList.contains('discord-theme')) {
            return;
        }
        const target = /** @type {HTMLElement} */ (event.target);
        if (target.closest('a, button, input, textarea, .mes_buttons, .mes_edit_buttons, .swipe_left, .swipe_right, .avatar, details')) {
            return;
        }
        const mes = target.closest('.mes');
        for (const other of chat.querySelectorAll(':scope > .mes.dsc-tapped')) {
            if (other !== mes) {
                other.classList.remove('dsc-tapped');
            }
        }
        mes?.classList.toggle('dsc-tapped');
    });
}

export function initMessages() {
    initTaps();
    const { eventTypes } = SillyTavern.getContext();
    const one = (mesId) => labelMessages(mesId);
    // a whole chat is printed before CHAT_CHANGED settles, so label after the current task
    const all = () => setTimeout(() => labelMessages(), 0);

    onEvent(eventTypes.CHARACTER_MESSAGE_RENDERED, one);
    onEvent(eventTypes.USER_MESSAGE_RENDERED, one);
    onEvent(eventTypes.MESSAGE_SWIPED, one);
    onEvent(eventTypes.MESSAGE_UPDATED, one);
    onEvent(eventTypes.MESSAGE_EDITED, one);
    onEvent(eventTypes.CHAT_CHANGED, all);
    onEvent(eventTypes.MORE_MESSAGES_LOADED, all);
    onEvent(eventTypes.MESSAGE_DELETED, all);
    all();
}
