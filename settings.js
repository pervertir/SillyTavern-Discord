// Discord's full-screen settings: a sidebar of sections on the left and the section on the
// right, with the round close button and "ESC" beside it. Each section is one of
// SillyTavern's own menus, opened in place; only the frame around them is the theme's.

import { showShortcuts } from './shortcuts.js';
import { closeDrawers, icon, isPhone, openDrawer, t } from './ui.js';

const OVERLAY_ID = 'dsc-settings';
const LAST_KEY = 'dsc-last-settings';

/** The sections, under Discord's headings; title gives SillyTavern's full name */
export const SECTIONS = [
    { heading: 'User Settings' },
    { id: 'persona-management-button', label: 'My Account', title: 'Persona Management' },
    { id: 'sys-settings-button', label: 'Connections', title: 'API Connections' },
    { heading: 'App Settings' },
    { id: 'user-settings-button', label: 'Appearance', title: 'User Settings' },
    { id: 'ai-config-button', label: 'AI Config', title: 'AI Response Configuration' },
    { id: 'advanced-formatting-button', label: 'Response Format', title: 'AI Response Formatting' },
    { id: 'WI-SP-button', label: 'World Info', title: 'World Info' },
    { id: 'backgrounds-button', label: 'Backgrounds', title: 'Backgrounds' },
    { id: 'extensions-settings-button', label: 'Extensions', title: 'Extensions' },
    { action: 'keybinds', label: 'Keybinds', title: 'Keyboard shortcuts' },
];

export const SETTINGS_DRAWERS = SECTIONS.filter(x => x.id).map(x => x.id);

let actions = { setTheme: (_appearance) => {}, isDark: () => true };

function rememberSection(id) {
    try {
        localStorage.setItem(LAST_KEY, id);
    } catch {
        // storage can be refused in private windows
    }
}

function lastSection() {
    try {
        const id = localStorage.getItem(LAST_KEY);
        return SETTINGS_DRAWERS.includes(id) ? id : SETTINGS_DRAWERS[0];
    } catch {
        return SETTINGS_DRAWERS[0];
    }
}

function createOverlay() {
    if (document.getElementById(OVERLAY_ID)) {
        return;
    }
    const overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-label', t('User Settings'));

    const side = document.createElement('div');
    side.className = 'dsc-set-side';
    const nav = document.createElement('nav');
    nav.className = 'dsc-set-nav';
    const phoneHead = document.createElement('div');
    phoneHead.className = 'dsc-set-phone-head';
    const phoneTitle = document.createElement('h1');
    phoneTitle.textContent = t('User Settings');
    phoneHead.append(phoneTitle);
    nav.append(phoneHead);
    for (const section of SECTIONS) {
        if (section.heading) {
            const heading = document.createElement('h2');
            heading.className = 'dsc-set-heading';
            heading.textContent = t(section.heading);
            nav.append(heading);
            continue;
        }
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'dsc-set-item';
        item.textContent = t(section.label);
        item.title = t(section.title);
        if (section.id) {
            item.dataset.drawer = section.id;
            item.addEventListener('click', () => openSection(section.id));
        } else if (section.action === 'keybinds') {
            item.addEventListener('click', () => showShortcuts());
        }
        nav.append(item);
    }
    const sep = document.createElement('div');
    sep.className = 'dsc-set-sep';
    const theme = document.createElement('button');
    theme.type = 'button';
    theme.className = 'dsc-set-item dsc-set-theme';
    theme.addEventListener('click', () => {
        actions.setTheme(actions.isDark() ? 'light' : 'dark');
        refreshThemeItem();
    });
    nav.append(sep, theme);
    side.append(nav);

    const main = document.createElement('div');
    main.className = 'dsc-set-main';
    const back = document.createElement('button');
    back.type = 'button';
    back.className = 'dsc-set-back';
    back.setAttribute('aria-label', t('Back'));
    back.append(icon('back', 20));
    // phones: back to the list of sections, as Discord mobile goes back
    back.addEventListener('click', () => {
        closeDrawers();
        document.body.classList.add('dsc-settings-list');
    });
    const title = document.createElement('h2');
    title.className = 'dsc-set-title';
    main.append(back, title);

    const close = document.createElement('div');
    close.className = 'dsc-set-close';
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.setAttribute('aria-label', t('Close'));
    closeButton.append(icon('close', 18));
    closeButton.addEventListener('click', closeSettings);
    const esc = document.createElement('span');
    esc.textContent = 'ESC';
    esc.setAttribute('aria-hidden', 'true');
    close.append(closeButton, esc);

    overlay.append(side, main, close);
    document.body.append(overlay);
    refreshThemeItem();

    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape' || !isOpen()) {
            return;
        }
        // leave Escape to dialogs and menus that sit above the settings
        if (document.querySelector('dialog.popup[open]') || !document.getElementById('dsc-menu')?.hidden) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        closeSettings();
    }, true);
}

function refreshThemeItem() {
    const item = document.querySelector(`#${OVERLAY_ID} .dsc-set-theme`);
    if (item) {
        item.textContent = t(actions.isDark() ? 'Switch to Light Theme' : 'Switch to Dark Theme');
    }
}

function isOpen() {
    const body = document.body.classList;
    return body.contains('dsc-settings-open') || body.contains('dsc-settings-list');
}

/** Opens one section (one of SillyTavern's menus). */
export function openSection(drawerId) {
    document.body.classList.remove('dsc-settings-list');
    rememberSection(drawerId);
    openDrawer(drawerId);
}

/** Opens the settings: on a section, or (no section given) where you left them. On phones
    without a section it shows the list of sections, as Discord mobile's You tab does. */
export function openSettings(drawerId = '') {
    if (!drawerId && isPhone()) {
        closeDrawers();
        document.body.classList.add('dsc-settings-list');
        refreshSettings();
        return;
    }
    openSection(drawerId || lastSection());
}

export function closeSettings() {
    document.body.classList.remove('dsc-settings-list');
    closeDrawers();
    refreshSettings();
}

/** Marks the open section and puts its name over it. Called when a menu opens or closes. */
export function refreshSettings() {
    const overlay = document.getElementById(OVERLAY_ID);
    if (!overlay) {
        return;
    }
    const open = SECTIONS.find(section => section.id && document.getElementById(section.id)?.classList.contains('dsc-open'));
    for (const item of overlay.querySelectorAll('.dsc-set-item[data-drawer]')) {
        item.classList.toggle('dsc-selected', item.dataset.drawer === open?.id);
    }
    overlay.querySelector('.dsc-set-title').textContent = open ? t(open.label) : '';
    refreshThemeItem();
}

/**
 * @param {object} options
 * @param {(appearance: string) => void} options.setTheme
 * @param {() => boolean} options.isDark
 */
export function initSettings(options) {
    actions = { ...actions, ...options };
    createOverlay();
}
