// Short messages: a long reply shows as several Discord messages, one after another, the way
// people text. SillyTavern keeps the reply as one message (swipes, edits, deleting,
// regenerating and the prompt all work on the whole), and only its text on screen is shown
// as parts (lib/message-splitter.js), each its own row with hover and time. A fresh reply
// comes in part by part with the typing dots between, unless it was already streamed in.

import { splitMessage } from './lib/message-splitter.js';
import { hideTyping, showTyping } from './presence.js';

let enabled = () => true;
let paced = () => true;
let streamed = false;
/** reveals in progress, by message id, so a newer render cancels them */
const reveals = new Map();

function shouldSplit(mes, message) {
    return enabled() && !!message && !message.is_user && !message.is_system
        && !mes.querySelector('.edit_textarea') && !mes.classList.contains('smallSysMes');
}

/**
 * Shows a message's text as parts. With reveal, the parts after the first come in one by one
 * with the typing line between.
 */
function renderParts(mes, { reveal = false } = {}) {
    const id = Number(mes.getAttribute('mesid'));
    const context = SillyTavern.getContext();
    const message = context.chat[id];
    const text = mes.querySelector('.mes_text');
    if (!text || !shouldSplit(mes, message)) {
        return;
    }
    const parts = splitMessage(message.mes);
    if (parts.length < 2) {
        delete text.dataset.dscParts;
        return;
    }
    const html = parts.map(part => context.messageFormatting(part, message.name, false, false, id));
    const sent = message.send_date ? context.timestampToMoment(message.send_date) : null;
    const time = sent?.isValid?.() ? sent.format('LT') : '';
    const rows = html.map((partHtml, index) => {
        const row = document.createElement('div');
        row.className = 'dsc-part';
        row.dataset.index = String(index);
        row.dataset.time = time;
        row.innerHTML = partHtml;
        return row;
    });
    text.replaceChildren(...rows);
    text.dataset.dscParts = String(rows.length);

    reveals.get(id)?.cancel();
    if (!reveal || !paced()) {
        return;
    }
    rows.slice(1).forEach(row => row.classList.add('dsc-part-hidden'));
    let cancelled = false;
    reveals.set(id, { cancel: () => { cancelled = true; rows.forEach(row => row.classList.remove('dsc-part-hidden')); } });
    (async () => {
        // let the reply's own "rendered" handlers (which clear the typing line) run first
        await new Promise(resolve => setTimeout(resolve, 0));
        for (const row of rows.slice(1)) {
            showTyping(message.name);
            // longer parts take longer to "type", within reason
            await new Promise(resolve => setTimeout(resolve, Math.min(2600, 500 + row.textContent.length * 18)));
            if (cancelled) {
                return;
            }
            row.classList.remove('dsc-part-hidden');
            document.getElementById('chat')?.scrollTo({ top: document.getElementById('chat').scrollHeight, behavior: 'smooth' });
        }
        hideTyping();
        reveals.delete(id);
    })();
}

function renderOne(mesId, options) {
    const mes = document.querySelector(`#chat > .mes[mesid="${Number(mesId)}"]`);
    if (mes) {
        renderParts(mes, options);
    }
}

/** Splits every reply on screen (a chat opened, older messages loaded, the setting turned on),
    or, when splitting is off, puts split replies back as one message. */
export function renderAllParts() {
    if (!enabled()) {
        restoreAll();
        return;
    }
    document.querySelectorAll('#chat > .mes[is_user="false"]').forEach(mes => renderParts(mes));
}

function restoreAll() {
    const context = SillyTavern.getContext();
    document.querySelectorAll('#chat > .mes .mes_text[data-dsc-parts]').forEach((text) => {
        const mes = text.closest('.mes');
        const id = Number(mes.getAttribute('mesid'));
        const message = context.chat[id];
        reveals.get(id)?.cancel();
        if (message) {
            text.innerHTML = context.messageFormatting(message.mes, message.name, !!message.is_system, !!message.is_user, id);
        }
        delete text.dataset.dscParts;
    });
}

/**
 * @param {object} options
 * @param {() => boolean} options.enabled Whether replies are split
 * @param {() => boolean} options.paced Whether a fresh reply comes in part by part
 */
export function initSplit(options) {
    enabled = options.enabled;
    paced = options.paced;
    const { eventSource, eventTypes } = SillyTavern.getContext();
    eventSource.on(eventTypes.GENERATION_STARTED, () => {
        streamed = false;
    });
    eventSource.on(eventTypes.STREAM_TOKEN_RECEIVED, () => {
        streamed = true;
    });
    eventSource.on(eventTypes.CHARACTER_MESSAGE_RENDERED, (mesId, type) => {
        const fresh = type !== 'first_message' && !streamed;
        renderOne(mesId, { reveal: fresh });
    });
    for (const type of [eventTypes.MESSAGE_UPDATED, eventTypes.MESSAGE_EDITED, eventTypes.MESSAGE_SWIPED]) {
        eventSource.on(type, mesId => setTimeout(() => renderOne(mesId), 0));
    }
    for (const type of [eventTypes.CHAT_CHANGED, eventTypes.MORE_MESSAGES_LOADED]) {
        eventSource.on(type, () => setTimeout(renderAllParts, 0));
    }
    setTimeout(renderAllParts, 0);
}
