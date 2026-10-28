// Small Discord behaviours around the chat:
// - a notice bar over the chat when no AI is connected ("You're not connected to an AI",
//   with a button to Connections), in place of SillyTavern's placeholder warning;
// - "You're viewing older messages" with Jump to Present when scrolled far up;
// - a long press on a phone opens the same menus a right-click does.

import { t } from './ui.js';

let openConnections = () => {};

function createNotice() {
    const sheld = document.getElementById('sheld');
    if (!sheld || document.getElementById('dsc-notice')) {
        return;
    }
    const notice = document.createElement('div');
    notice.id = 'dsc-notice';
    notice.setAttribute('role', 'status');
    const text = document.createElement('span');
    text.textContent = t("You're not connected to an AI, so no one can reply yet.");
    const action = document.createElement('button');
    action.type = 'button';
    action.textContent = t('Connect');
    action.addEventListener('click', () => openConnections());
    notice.append(text, action);
    document.getElementById('dsc-head')?.after(notice);
}

/** Follows SillyTavern's own no-connection mark on the message box. */
function watchConnection() {
    const form = document.getElementById('send_form');
    if (!form) {
        return;
    }
    const update = () => document.body.classList.toggle('dsc-offline-api', form.classList.contains('no-connection'));
    new MutationObserver(update).observe(form, { attributes: true, attributeFilter: ['class'] });
    update();
}

function createJumpBar() {
    const chat = document.getElementById('chat');
    const form = document.getElementById('form_sheld');
    if (!chat || !form || document.getElementById('dsc-jump')) {
        return;
    }
    const bar = document.createElement('div');
    bar.id = 'dsc-jump';
    const text = document.createElement('span');
    text.textContent = t("You're viewing older messages");
    const jump = document.createElement('button');
    jump.type = 'button';
    jump.textContent = t('Jump to Present');
    jump.addEventListener('click', () => chat.scrollTo({ top: chat.scrollHeight, behavior: 'smooth' }));
    bar.append(text, jump);
    form.prepend(bar);
    let frame = 0;
    chat.addEventListener('scroll', () => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
            const far = chat.scrollHeight - chat.scrollTop - chat.clientHeight > chat.clientHeight * 1.5;
            bar.classList.toggle('dsc-on', far);
        });
    }, { passive: true });
}

/** Touch: hold for half a second to open the right-click menu of what's under the finger. */
function longPress() {
    let timer = 0;
    let start = null;
    document.addEventListener('touchstart', (event) => {
        if (!document.body.classList.contains('discord-theme') || event.touches.length !== 1) {
            return;
        }
        const target = /** @type {HTMLElement} */ (event.target);
        if (!target.closest('#chat .mes, #dsc-side .dsc-dm, #dsc-side .dsc-channel, #dsc-guilds .dsc-server') || target.closest('textarea, input')) {
            return;
        }
        const touch = event.touches[0];
        start = { x: touch.clientX, y: touch.clientY, target };
        timer = setTimeout(() => {
            start.target.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: start.x, clientY: start.y }));
            navigator.vibrate?.(10);
            start = null;
        }, 500);
    }, { passive: true });
    const cancel = (event) => {
        if (!start) {
            return;
        }
        const touch = event.touches?.[0];
        if (!touch || Math.hypot(touch.clientX - start.x, touch.clientY - start.y) > 10 || event.type !== 'touchmove') {
            clearTimeout(timer);
            start = null;
        }
    };
    for (const type of ['touchend', 'touchmove', 'touchcancel']) {
        document.addEventListener(type, cancel, { passive: true });
    }
}

/** @param {{connections: () => void}} options */
export function initOverlays(options) {
    openConnections = options.connections;
    createNotice();
    watchConnection();
    createJumpBar();
    longPress();
}
