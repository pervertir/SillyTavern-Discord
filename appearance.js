// Discord's theme picker at the top of the Appearance page: round swatches for Light, Ash,
// Dark, Onyx and Sync, then the Nitro "Color" themes as gradient swatches.

import { gradientOf, NITRO_THEMES } from './nitro.js';
import { icon, t } from './ui.js';

const ID = 'dsc-appearance';

const BASES = [
    { id: 'light', name: 'Light', swatch: '#fbfbfb' },
    { id: 'ash', name: 'Ash', swatch: '#323339' },
    { id: 'dark', name: 'Dark', swatch: '#1a1a1e' },
    { id: 'onyx', name: 'Onyx', swatch: '#000000' },
    { id: 'system', name: 'Sync with computer', swatch: 'linear-gradient(135deg, #fbfbfb 50%, #1a1a1e 50%)' },
];

let actions = {
    current: () => ({ appearance: 'dark', nitroTheme: '' }),
    setBase: (_id) => {},
    setNitro: (_id) => {},
};

function swatch(className, label, background, selected, run) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `dsc-swatch ${className}`;
    button.setAttribute('aria-label', label);
    button.setAttribute('aria-pressed', String(selected));
    button.dataset.dscTip = label;
    button.style.background = background;
    button.classList.toggle('dsc-selected', selected);
    if (selected) {
        const check = document.createElement('span');
        check.className = 'dsc-swatch-check';
        check.append(icon('check', 12));
        button.append(check);
    }
    button.addEventListener('click', run);
    return button;
}

/** Draws the picker for the current choice. */
export function renderAppearance() {
    const root = document.getElementById(ID);
    if (!root) {
        return;
    }
    const { appearance, nitroTheme } = actions.current();
    const themeRow = root.querySelector('.dsc-swatches-base');
    const colorRow = root.querySelector('.dsc-swatches-color');
    themeRow.replaceChildren(...BASES.map(base => swatch('', t(base.name), base.swatch, !nitroTheme && appearance === base.id, () => actions.setBase(base.id))));
    colorRow.replaceChildren(...NITRO_THEMES.map(theme => swatch('dsc-swatch-gradient', t(theme.name), gradientOf(theme), nitroTheme === theme.id, () => actions.setNitro(theme.id))));
}

function build() {
    const host = document.getElementById('UI-Theme-Block');
    if (!host || document.getElementById(ID)) {
        return;
    }
    const root = document.createElement('section');
    root.id = ID;
    const themeTitle = document.createElement('h4');
    themeTitle.className = 'dsc-ap-title';
    themeTitle.textContent = t('Theme');
    const themeRow = document.createElement('div');
    themeRow.className = 'dsc-swatches dsc-swatches-base';
    const colorTitle = document.createElement('h4');
    colorTitle.className = 'dsc-ap-title';
    colorTitle.append(document.createTextNode(t('Color')), icon('nitro', 16));
    const colorText = document.createElement('p');
    colorText.className = 'dsc-ap-note';
    colorText.textContent = t('Make Discord yours with a color theme.');
    const colorRow = document.createElement('div');
    colorRow.className = 'dsc-swatches dsc-swatches-color';
    root.append(themeTitle, themeRow, colorTitle, colorText, colorRow);
    host.prepend(root);
}

/**
 * @param {object} options
 * @param {() => {appearance: string, nitroTheme: string}} options.current
 * @param {(id: string) => void} options.setBase
 * @param {(id: string) => void} options.setNitro
 */
export function initAppearance(options) {
    actions = { ...actions, ...options };
    build();
    renderAppearance();
}
