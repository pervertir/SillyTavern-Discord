// Discord's message box: the round + on the left (SillyTavern's chat options), and gift, GIF
// and sticker on the right (SillyTavern's Continue, Regenerate and Impersonate), then Apps
// (the extensions menu) and the emoji picker.

import { initEmojiPicker, toggleEmojiPicker } from './emoji-picker.js';
import { clickOption, iconButton, t } from './ui.js';

const TOOLS_ID = 'dsc-compose-tools';

/** Opens the extensions menu (SillyTavern's wand) from the Apps button. */
function openExtensionsMenu(anchor = /** @type {HTMLElement|null} */ (document.querySelector('#dsc-compose-tools .dsc-compose-apps'))) {
    document.getElementById('extensionsMenuButton')?.click();
    // SillyTavern places the menu by its own (hidden) wand button; put it above Apps instead
    const menu = document.getElementById('extensionsMenu');
    const box = anchor?.getBoundingClientRect();
    if (!menu || !box || !box.width) {
        return;
    }
    requestAnimationFrame(() => {
        const own = menu.getBoundingClientRect();
        const left = Math.max(8, Math.min(box.right - own.width, window.innerWidth - own.width - 8));
        const top = Math.max(8, box.top - own.height - 8);
        for (const [key, value] of [['position', 'fixed'], ['inset', 'auto'], ['transform', 'none'], ['left', `${Math.round(left)}px`], ['top', `${Math.round(top)}px`]]) {
            menu.style.setProperty(key, value, 'important');
        }
    });
}

export function initCompose() {
    const right = document.getElementById('rightSendForm');
    if (!right || document.getElementById(TOOLS_ID)) {
        return;
    }
    const tools = document.createElement('div');
    tools.id = TOOLS_ID;
    const tool = (label, iconName, run) => {
        const button = iconButton('dsc-compose-tool', t(label), iconName);
        button.addEventListener('click', run);
        button.classList.add(`dsc-compose-${iconName}`);
        return button;
    };
    tools.append(
        tool('Continue', 'gift', () => clickOption('option_continue')),
        tool('Regenerate', 'gif', () => clickOption('option_regenerate')),
        tool('Impersonate', 'sticker', () => clickOption('option_impersonate')),
        // SillyTavern closes its menu on any click that reaches the page outside its own button
        tool('Apps', 'apps', (event) => {
            event.stopPropagation();
            openExtensionsMenu(/** @type {HTMLElement} */ (event.currentTarget));
        }),
        tool('Select emoji', 'emoji', event => toggleEmojiPicker(/** @type {HTMLElement} */ (event.currentTarget))),
    );
    initEmojiPicker();
    right.prepend(tools);
}

/** Ctrl/⌘+E: the emoji picker, as in Discord. */
export function openEmojiFromShortcut() {
    toggleEmojiPicker(/** @type {HTMLElement} */ (document.querySelector('#dsc-compose-tools .dsc-compose-emoji')));
}
