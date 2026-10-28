// Discord's message box: the round + on the left (SillyTavern's chat options), and gift, GIF,
// sticker and emoji on the right, each doing one of SillyTavern's message actions.

import { clickOption, iconButton, t } from './ui.js';

const TOOLS_ID = 'dsc-compose-tools';

/** Opens the extensions menu (SillyTavern's wand) from the emoji button. */
export function openExtensionsMenu() {
    document.getElementById('extensionsMenuButton')?.click();
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
        return button;
    };
    tools.append(
        tool('Continue', 'gift', () => clickOption('option_continue')),
        tool('Regenerate', 'gif', () => clickOption('option_regenerate')),
        tool('Impersonate', 'sticker', () => clickOption('option_impersonate')),
        tool('Extensions', 'emoji', openExtensionsMenu),
    );
    right.prepend(tools);
}
