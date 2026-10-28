// Discord's message flow: a message from the same author within seven minutes joins the one
// before it without repeating the name and picture, a date line starts each new day, and
// times read "Today at 4:20 PM". Everything goes into attributes on SillyTavern's own message
// elements; CSS does the rest. Work happens on SillyTavern's message events, never on a
// watcher over the chat.

import { t } from './ui.js';

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

function momentOf(mes) {
    const { chat, timestampToMoment } = SillyTavern.getContext();
    const message = chat[Number(mes.getAttribute('mesid'))];
    if (!message?.send_date) {
        return null;
    }
    const time = timestampToMoment(message.send_date);
    return time?.isValid?.() ? time : null;
}

/** "Today at 4:20 PM", "Yesterday at 9:03 AM", or "10/21/2026 3:15 PM". */
export function formatMessageTime(time) {
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

function labelMessage(mes) {
    const time = momentOf(mes);
    const stamp = /** @type {HTMLElement} */ (mes.querySelector('.timestamp'));
    const previous = previousMessage(mes);
    const previousTime = previous ? momentOf(previous) : null;

    if (time) {
        if (stamp) {
            stamp.dataset.dscTime = formatMessageTime(time);
            stamp.dataset.dscShort = clock(time);
            stamp.dataset.dscTip = time.format('LLLL');
        }
        mes.dataset.dscShort = clock(time);
    } else {
        delete stamp?.dataset.dscTime;
        delete stamp?.dataset.dscShort;
        delete mes.dataset.dscShort;
    }

    const newDay = !!time && (!previousTime || !time.isSame(previousTime, 'day'));
    if (newDay) {
        mes.dataset.dscDay = time.format('LL');
    } else {
        delete mes.dataset.dscDay;
    }

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
    chat?.addEventListener('click', (event) => {
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
    const { eventSource, eventTypes } = SillyTavern.getContext();
    const one = (mesId) => labelMessages(mesId);
    // a whole chat is printed before CHAT_CHANGED settles, so label after the current task
    const all = () => setTimeout(() => labelMessages(), 0);

    eventSource.on(eventTypes.CHARACTER_MESSAGE_RENDERED, one);
    eventSource.on(eventTypes.USER_MESSAGE_RENDERED, one);
    eventSource.on(eventTypes.MESSAGE_SWIPED, one);
    eventSource.on(eventTypes.MESSAGE_UPDATED, one);
    eventSource.on(eventTypes.MESSAGE_EDITED, one);
    eventSource.on(eventTypes.CHAT_CHANGED, all);
    eventSource.on(eventTypes.MORE_MESSAGES_LOADED, all);
    eventSource.on(eventTypes.MESSAGE_DELETED, all);
    all();
}
