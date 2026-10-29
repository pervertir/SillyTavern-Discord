// Two of Discord's App Settings pages that SillyTavern has no menu for: Notifications
// (desktop notifications and every sound, as switch rows) and Keybinds (every shortcut with
// its keys). Notifications uses the same settings as the extension panel's options and keeps
// that panel in step.

import { registerPage } from './settings.js';
import { escapeHtml, t } from './ui.js';
import { keysHtml, shortcutGroups } from './shortcuts.js';

let actions = {
    settings: () => /** @type {any} */ ({}),
    save: () => {},
    play: (_name) => {},
    enableDesktop: async () => false,
};

function page(id) {
    let element = document.getElementById(id);
    if (!element) {
        element = document.createElement('div');
        element.id = id;
        document.body.append(element);
    }
    return element;
}

/** The extension panel's own field for a setting, so it shows the same value. */
const PANEL_IDS = {
    desktopNotifications: 'dsc_desktop_notifications',
    sounds: 'dsc_sounds',
    soundVolume: 'dsc_sound_volume',
    soundMessage: 'dsc_sound_message',
    soundAlways: 'dsc_sound_always',
    soundOnline: 'dsc_sound_online',
    soundVoice: 'dsc_sound_voice',
};

function syncPanel(key, value) {
    const field = /** @type {HTMLInputElement|null} */ (document.getElementById(PANEL_IDS[key]));
    if (!field) {
        return;
    }
    if (field.type === 'checkbox') {
        field.checked = !!value;
    } else {
        field.value = String(value);
    }
}

/** A Discord switch row: title, note, switch on the right. */
function switchRow(key, title, note, { onChange, disabledBy } = {}) {
    const row = document.createElement('label');
    row.className = 'dsc-pg-row';
    const text = document.createElement('span');
    const name = document.createElement('b');
    name.textContent = t(title);
    text.append(name);
    if (note) {
        const small = document.createElement('small');
        small.textContent = t(note);
        text.append(small);
    }
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = !!actions.settings()[key];
    box.addEventListener('change', async () => {
        const value = onChange ? await onChange(box.checked) : box.checked;
        box.checked = value;
        actions.settings()[key] = value;
        actions.save();
        syncPanel(key, value);
        renderNotifications();
    });
    if (disabledBy && !actions.settings()[disabledBy]) {
        row.classList.add('dsc-pg-off');
        box.disabled = true;
    }
    row.append(text, box);
    return row;
}

function section(title, ...rows) {
    const block = document.createElement('section');
    block.className = 'dsc-pg-section';
    const heading = document.createElement('h3');
    heading.textContent = t(title);
    block.append(heading, ...rows);
    return block;
}

export function renderNotifications() {
    const element = page('dsc-notifications');
    const settings = actions.settings();
    const desktop = switchRow('desktopNotifications', 'Enable Desktop Notifications',
        'Shows a notification for replies that arrive while this window isn\'t in front. Your browser asks for permission the first time. Off while you\'re set to Do Not Disturb.',
        { onChange: async on => on && await actions.enableDesktop() });

    const volume = document.createElement('div');
    volume.className = 'dsc-pg-row dsc-pg-slider';
    volume.classList.toggle('dsc-pg-off', !settings.sounds);
    const volumeText = document.createElement('span');
    const volumeName = document.createElement('b');
    volumeName.textContent = t('Volume');
    volumeText.append(volumeName);
    const range = document.createElement('input');
    range.type = 'range';
    range.min = '0';
    range.max = '100';
    range.step = '5';
    range.value = String(settings.soundVolume ?? 60);
    range.disabled = !settings.sounds;
    const shown = document.createElement('span');
    shown.className = 'dsc-pg-value';
    shown.textContent = `${range.value}%`;
    range.addEventListener('input', () => {
        shown.textContent = `${range.value}%`;
        actions.settings().soundVolume = Number(range.value);
        actions.save();
        syncPanel('soundVolume', range.value);
    });
    range.addEventListener('change', () => actions.play('message'));
    volume.append(volumeText, range, shown);

    element.replaceChildren(
        section('Notifications', desktop),
        section('Sounds',
            switchRow('sounds', 'Play Sounds', 'Discord\'s sounds for messages, people coming online, and mute and deafen.'),
            volume,
            switchRow('soundMessage', 'Message', 'A reply arrives while the window isn\'t in front.', { disabledBy: 'sounds' }),
            switchRow('soundAlways', 'Every Reply', 'Ping for replies in the chat you\'re looking at too (Discord doesn\'t).', { disabledBy: 'sounds' }),
            switchRow('soundOnline', 'Someone Comes Online', '', { disabledBy: 'sounds' }),
            switchRow('soundVoice', 'Mute and Deafen', '', { disabledBy: 'sounds' }),
        ),
    );
    return element;
}

export function renderKeybinds() {
    const element = page('dsc-keybinds-page');
    const intro = document.createElement('p');
    intro.className = 'dsc-pg-intro';
    intro.textContent = t('Every shortcut in the theme. Press Ctrl/⌘ + / anywhere to see them in a popup.').replace('Ctrl/⌘', /Mac/i.test(navigator.platform) ? '⌘' : 'Ctrl');
    element.replaceChildren(intro, ...shortcutGroups().map(([title, items]) => {
        const block = document.createElement('section');
        block.className = 'dsc-pg-section';
        block.innerHTML = `<h3>${escapeHtml(t(title))}</h3>${items.map(([label, keys]) => `<div class="dsc-pg-row dsc-pg-key"><b>${escapeHtml(t(label))}</b><span class="dsc-kb-keys">${keysHtml(keys)}</span></div>`).join('')}`;
        return block;
    }));
    return element;
}

/**
 * @param {object} options
 * @param {() => any} options.settings
 * @param {() => void} options.save
 * @param {(name: string) => void} options.play
 * @param {() => Promise<boolean>} options.enableDesktop
 */
export function initPages(options) {
    actions = { ...actions, ...options };
    registerPage('notifications', renderNotifications);
    registerPage('keybinds', renderKeybinds);
}
