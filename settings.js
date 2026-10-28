// Discord's full-screen settings: a sidebar of sections on the left and the section on the
// right, with the round close button and "ESC" beside it. Each section is one of
// SillyTavern's own menus, opened in place; only the frame around them is the theme's.

import { showShortcuts } from './shortcuts.js';
import { closeDrawers, icon, isPhone, openDrawer, shieldFromOutsideClose, t } from './ui.js';

const OVERLAY_ID = 'dsc-settings';
const LAST_KEY = 'dsc-last-settings-section';

/** The sections, under Discord's headings; title gives SillyTavern's full name */
/* A section is a whole menu, or one part of a long one (part: the id of its block), so each
   page holds one topic as Discord's do. */
export const SECTIONS = [
    { heading: 'User Settings' },
    { id: 'persona-management-button', label: 'My Account', title: 'Persona Management' },
    { id: 'sys-settings-button', label: 'Connections', title: 'API Connections' },
    { heading: 'App Settings' },
    { id: 'user-settings-button', part: 'UI-Theme-Block', label: 'Appearance', title: 'User Settings: UI Theme' },
    { id: 'user-settings-button', part: 'power-user-options-block', label: 'Chat', title: 'User Settings: Chat/Message Handling' },
    { id: 'user-settings-button', part: 'UI-Customization', label: 'Advanced', title: 'User Settings: Character Handling and Miscellaneous' },
    { id: 'backgrounds-button', label: 'Backgrounds', title: 'Backgrounds' },
    { action: 'keybinds', label: 'Keybinds', title: 'Keyboard shortcuts' },
    { heading: 'AI Settings' },
    { id: 'ai-config-button', label: 'AI Config', title: 'AI Response Configuration' },
    { id: 'advanced-formatting-button', part: 'ContextSettings', label: 'Context Template', title: 'AI Response Formatting: Context Template' },
    { id: 'advanced-formatting-button', part: 'InstructSettingsColumn', label: 'Instruct Template', title: 'AI Response Formatting: Instruct Template' },
    { id: 'advanced-formatting-button', part: 'SystemPromptColumn', label: 'System Prompt', title: 'AI Response Formatting: System Prompt and more' },
    { id: 'WI-SP-button', label: 'World Info', title: 'World Info' },
    { heading: 'Apps' },
    { id: 'extensions-settings-button', label: 'Extensions', title: 'Extensions' },
];

/** The blocks each split menu is made of */
const PARTS = Object.fromEntries(SECTIONS.filter(x => x.part).reduce((map, { id, part }) => {
    map.set(id, [...(map.get(id) ?? []), part]);
    return map;
}, new Map()));

let currentPart = '';

export const SETTINGS_DRAWERS = [...new Set(SECTIONS.filter(x => x.id).map(x => x.id))];

let actions = { setTheme: (_appearance) => {}, isDark: () => true, drawersChanged: () => {} };
let switchTimer = 0;

function rememberSection(id, part) {
    try {
        localStorage.setItem(LAST_KEY, JSON.stringify({ id, part }));
    } catch {
        // storage can be refused in private windows
    }
}

function lastSection() {
    try {
        const { id, part } = JSON.parse(localStorage.getItem(LAST_KEY) || '{}');
        if (id && SECTIONS.some(x => x.id === id && (x.part ?? '') === (part ?? ''))) {
            return { id, part: part ?? '' };
        }
    } catch {
        // fall through to the first section
    }
    return { id: SETTINGS_DRAWERS[0], part: '' };
}

/** Shows one block of a split menu and hides its others; no part shows them all. */
function showPart(drawerId, part) {
    currentPart = part;
    for (const [id, parts] of Object.entries(PARTS)) {
        for (const block of parts) {
            document.getElementById(block)?.classList.toggle('dsc-part-hidden', id === drawerId && !!part && block !== part);
        }
    }
    // a part starts at its top
    if (drawerId) {
        document.querySelector(`#${drawerId} > .drawer-content`)?.scrollTo({ top: 0 });
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
            item.dataset.part = section.part ?? '';
            item.addEventListener('click', () => openSection(section.id, section.part ?? ''));
        } else if (section.action === 'keybinds') {
            item.addEventListener('click', () => showShortcuts());
        }
        nav.append(item);
        if (section.id === 'WI-SP-button') {
            const books = document.createElement('div');
            books.className = 'dsc-set-books';
            books.addEventListener('click', (event) => {
                const row = /** @type {HTMLElement} */ (event.target).closest('.dsc-set-book');
                if (row) {
                    openBook(row.dataset.value);
                }
            });
            nav.append(books);
        }
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
    shieldFromOutsideClose(overlay);
    refreshThemeItem();

    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape' || !isOpen()) {
            return;
        }
        // leave Escape to dialogs and menus that sit above the settings
        const menu = document.getElementById('dsc-menu');
        if (document.querySelector('dialog.popup[open]') || (menu && !menu.hidden)) {
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

/* World Info: each lorebook as a channel under the section, as a server lists its channels */

function getBookSelect() {
    return /** @type {HTMLSelectElement} */ (document.getElementById('world_editor_select'));
}

/** Lists the lorebooks under World Info, the one being edited marked. */
export function refreshBooks() {
    const holder = document.querySelector(`#${OVERLAY_ID} .dsc-set-books`);
    const select = getBookSelect();
    if (!holder || !select) {
        return;
    }
    const open = document.getElementById('WI-SP-button')?.classList.contains('dsc-open');
    holder.replaceChildren(...[...select.options].filter(option => option.value !== '').map((option) => {
        const row = document.createElement('button');
        row.type = 'button';
        row.className = 'dsc-set-book';
        row.dataset.value = option.value;
        row.classList.toggle('dsc-selected', open && option.selected);
        row.append(icon('hash', 16));
        const name = document.createElement('span');
        name.textContent = option.textContent.trim().toLowerCase().replace(/\s+/g, '-');
        name.title = option.textContent.trim();
        row.append(name);
        return row;
    }));
}

/** Opens World Info on one lorebook, picking it in SillyTavern's own list. */
function openBook(value) {
    openSection('WI-SP-button', '');
    const select = getBookSelect();
    if (select && select.value !== value) {
        select.value = value;
        select.dispatchEvent(new Event('change', { bubbles: true }));
    }
    refreshBooks();
}

/** Opens one section: one of SillyTavern's menus, or one part of it. */
export function openSection(drawerId, part = '') {
    const openId = SETTINGS_DRAWERS.find(id => document.getElementById(id)?.classList.contains('dsc-open'));
    if (openId && openId !== drawerId) {
        // SillyTavern closes the open menu before opening this one; hold the settings up meanwhile
        document.body.classList.add('dsc-settings-switching');
        clearTimeout(switchTimer);
        switchTimer = setTimeout(() => {
            document.body.classList.remove('dsc-settings-switching');
            actions.drawersChanged();
        }, 1000);
    }
    document.body.classList.remove('dsc-settings-list');
    rememberSection(drawerId, part);
    showPart(drawerId, part);
    openDrawer(drawerId);
    refreshSettings();
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
    if (drawerId) {
        openSection(drawerId, SECTIONS.find(x => x.id === drawerId && x.part)?.part ?? '');
        return;
    }
    const last = lastSection();
    openSection(last.id, last.part);
}

export function closeSettings() {
    document.body.classList.remove('dsc-settings-list');
    showPart('', '');
    closeDrawers();
    refreshSettings();
}

/** Marks the open section and puts its name over it. Called when a menu opens or closes. */
export function refreshSettings() {
    const overlay = document.getElementById(OVERLAY_ID);
    if (!overlay) {
        return;
    }
    const openId = SETTINGS_DRAWERS.find(id => document.getElementById(id)?.classList.contains('dsc-open'));
    // closed some other way (SillyTavern's own Escape, a shortcut): show whole menus again
    if (!openId && currentPart) {
        showPart('', '');
    }
    const open = SECTIONS.find(section => section.id === openId && (section.part ?? '') === currentPart)
        ?? SECTIONS.find(section => section.id === openId);
    for (const item of overlay.querySelectorAll('.dsc-set-item[data-drawer]')) {
        item.classList.toggle('dsc-selected', item.dataset.drawer === open?.id && item.dataset.part === (open?.part ?? ''));
    }
    overlay.querySelector('.dsc-set-title').textContent = open ? t(open.label) : '';
    refreshThemeItem();
    refreshBooks();
}

/**
 * @param {object} options
 * @param {(appearance: string) => void} options.setTheme
 * @param {() => boolean} options.isDark
 * @param {() => void} options.drawersChanged
 */
export function initSettings(options) {
    actions = { ...actions, ...options };
    createOverlay();
    const { eventSource, eventTypes } = SillyTavern.getContext();
    for (const type of [eventTypes.WORLDINFO_UPDATED, eventTypes.WORLDINFO_SETTINGS_UPDATED]) {
        if (type) {
            eventSource.on(type, () => setTimeout(refreshBooks, 0));
        }
    }
    getBookSelect()?.addEventListener('change', () => setTimeout(refreshBooks, 0));
    refreshBooks();
}
