// Discord theme: toggles the scoped styles in style.css, builds the Discord frame (server
// rail, conversation list, your panel, chat header, profile panel, Friends page, settings
// and quick switcher) and exposes a small settings panel.

import { initCompose, openExtensionsMenu } from './compose.js';
import { hideDiscover, initDiscover, showDiscover } from './discover.js';
import { initEditor, refreshEditor } from './editor.js';
import { getCurrentPlace, initData, scheduleRefresh } from './data.js';
import { refreshTitle, setDisguise } from './disguise.js';
import { initHeader, openInbox, refreshHeader, setFriendsTab, togglePinCurrent } from './header.js';
import { initMessages, labelMessages } from './messages.js';
import { initMonograms } from './monograms.js';
import { initSettings, openSettings, refreshSettings, SETTINGS_DRAWERS } from './settings.js';
import { formatKeys, initShortcuts, SHORTCUTS } from './shortcuts.js';
import { initSidebar, markCurrent, openCharacterPanel, refreshPersona, stepConversation, stepServer } from './sidebar.js';
import { initSwitcher, openSwitcher } from './switcher.js';
import { clickOption, closeDrawers, initTooltips, isPhone } from './ui.js';

const MODULE_NAME = 'discordTheme';
/** Folder path under scripts/extensions/, e.g. third-party/SillyTavern-Discord */
const EXTENSION_FOLDER = new URL('.', import.meta.url).pathname
    .replace(/^.*\/scripts\/extensions\//, '')
    .replace(/\/$/, '');
const BODY_CLASS = 'discord-theme';

const defaultSettings = Object.freeze({
    enabled: true,
    /** Discord's themes: dark, ash, onyx or light; or system (light or dark with the OS) */
    appearance: 'dark',
    /** The profile panel in DMs and the member list in servers */
    aside: true,
    /** cozy (pictures and names) or compact (one line per message) */
    messageDisplay: 'cozy',
    /** Green "online" dots on everyone */
    presence: true,
    /** "Today at 4:20 PM" in place of SillyTavern's long dates */
    discordTimes: true,
    recentMax: 50,
});

const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

function getSettings() {
    const { extensionSettings } = SillyTavern.getContext();
    if (!extensionSettings[MODULE_NAME]) {
        extensionSettings[MODULE_NAME] = structuredClone(defaultSettings);
    }
    const settings = extensionSettings[MODULE_NAME];
    for (const key of Object.keys(defaultSettings)) {
        if (!Object.hasOwn(settings, key)) {
            settings[key] = structuredClone(defaultSettings[key]);
        }
    }
    return settings;
}

function saveSettings() {
    SillyTavern.getContext().saveSettingsDebounced();
}

function isDark(settings = getSettings()) {
    return settings.appearance !== 'light' && (settings.appearance !== 'system' || darkQuery.matches);
}

/** The body classes for a theme: Dark has none, Ash, Onyx and Light one each. */
function applyThemeClasses(settings, on) {
    const body = document.body.classList;
    const dark = isDark(settings);
    body.toggle('dsc-light', on && !dark);
    body.toggle('dsc-ash', on && dark && settings.appearance === 'ash');
    body.toggle('dsc-onyx', on && dark && settings.appearance === 'onyx');
}

function applySettings() {
    const settings = getSettings();
    const on = !!settings.enabled;
    const body = document.body.classList;
    body.toggle(BODY_CLASS, on);
    document.documentElement.classList.toggle('dsc-html', on);
    applyThemeClasses(settings, on);
    body.toggle('dsc-aside-on', on && !!settings.aside);
    body.toggle('dsc-compact', on && settings.messageDisplay === 'compact');
    body.toggle('dsc-presence', on && !!settings.presence);
    body.toggle('dsc-times', on && !!settings.discordTimes);
    setDisguise(on);
    refreshHeader();
}

function setTheme(appearance) {
    const settings = getSettings();
    settings.appearance = appearance;
    applySettings();
    saveSettings();
    const select = /** @type {HTMLSelectElement} */ (document.getElementById('dsc_appearance'));
    if (select) {
        select.value = appearance;
    }
}

function toggleAside() {
    const settings = getSettings();
    settings.aside = !settings.aside;
    applySettings();
    saveSettings();
    const box = /** @type {HTMLInputElement} */ (document.getElementById('dsc_aside'));
    if (box) {
        box.checked = settings.aside;
    }
}

/** Friends stands in for the chat (on = true), or the chat comes back; tab picks its tab. */
function showFriends(on, tab = '') {
    hideDiscover();
    if (tab) {
        setFriendsTab(tab);
    }
    document.body.classList.toggle('dsc-friends', !!on);
    if (on) {
        document.body.classList.add('dsc-m-chat');
    }
    refreshHeader();
    refreshTitle();
    markCurrent();
}

/** Phones show one pane at a time: the lists, or the chat. */
function showChat() {
    hideDiscover();
    document.body.classList.remove('dsc-friends');
    if (isPhone()) {
        document.body.classList.add('dsc-m-chat');
    }
    refreshHeader();
    refreshTitle();
    markCurrent();
}

/** Discover in the chat's place (the rail's compass). */
function openDiscover() {
    closeDrawers();
    document.body.classList.remove('dsc-friends');
    if (isPhone()) {
        document.body.classList.add('dsc-m-chat');
    }
    showDiscover();
}

function back() {
    document.body.classList.remove('dsc-m-chat');
}

function onChatChanged(chatId) {
    if (chatId) {
        hideDiscover();
        document.body.classList.remove('dsc-friends');
        if (isPhone() && !document.body.classList.contains('dsc-booting')) {
            document.body.classList.add('dsc-m-chat');
        }
    }
    refreshHeader();
    refreshTitle();
    markCurrent();
}

/**
 * Mirrors which menus are open as classes (drawer.dsc-open; body.dsc-settings-open for the
 * settings, dsc-chars-open for the character panel), so the styles need no page-wide :has()
 * checks, which make the browser re-check the whole page on every change.
 */
function trackDrawers() {
    const drawers = [...document.querySelectorAll('#top-settings-holder > .drawer')];
    const update = () => {
        let settings = false;
        let chars = false;
        for (const drawer of drawers) {
            const open = !!drawer.querySelector(':scope > .drawer-content.openDrawer');
            drawer.classList.toggle('dsc-open', open);
            settings ||= open && SETTINGS_DRAWERS.includes(drawer.id);
            chars ||= open && drawer.id === 'rightNavHolder';
        }
        const body = document.body.classList;
        body.toggle('dsc-settings-open', settings);
        if (settings) {
            body.remove('dsc-settings-list');
        }
        const charsChanged = body.contains('dsc-chars-open') !== chars;
        body.toggle('dsc-chars-open', chars);
        refreshSettings();
        markCurrent();
        if (charsChanged) {
            refreshHeader();
            refreshEditor();
        }
    };
    const observer = new MutationObserver(update);
    for (const drawer of drawers) {
        const content = drawer.querySelector(':scope > .drawer-content');
        if (content) {
            observer.observe(content, { attributes: true, attributeFilter: ['class'] });
        }
    }
    update();
}

/** Bottom tabs on phones: Home, Notifications and You, as Discord mobile has. */
function createPhoneTabs() {
    if (document.getElementById('dsc-tabs')) {
        return;
    }
    const tabs = document.createElement('nav');
    tabs.id = 'dsc-tabs';
    const tab = (key, label, iconName, run) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'dsc-tab';
        button.dataset.tab = key;
        const glyph = document.createElement('i');
        glyph.className = 'dsc-ico';
        glyph.style.setProperty('--dsc-icon-url', `var(--dsc-i-${iconName})`);
        const text = document.createElement('span');
        text.textContent = SillyTavern.getContext().translate(label);
        button.append(glyph, text);
        button.addEventListener('click', run);
        return button;
    };
    tabs.append(
        tab('home', 'Home', 'clyde', () => {
            closeDrawers();
            document.body.classList.remove('dsc-settings-list', 'dsc-m-chat', 'dsc-friends');
            refreshHeader();
        }),
        tab('notifications', 'Notifications', 'bell', () => {
            closeDrawers();
            document.body.classList.remove('dsc-settings-list');
            setFriendsTab('activity');
            showFriends(true);
        }),
        tab('you', 'You', 'gear', () => openSettings('')),
    );
    document.body.append(tabs);
}

async function renderSettingsPanel() {
    const { renderExtensionTemplateAsync } = SillyTavern.getContext();
    const html = await renderExtensionTemplateAsync(EXTENSION_FOLDER, 'settings');
    const container = document.getElementById('extensions_settings2');
    if (!container || document.querySelector('.dsc-settings-panel')) {
        return;
    }
    container.insertAdjacentHTML('beforeend', html);

    const settings = getSettings();
    const byId = id => /** @type {HTMLInputElement} */ (document.getElementById(id));
    const enabled = byId('dsc_enabled');
    const appearance = byId('dsc_appearance');
    const aside = byId('dsc_aside');
    const display = byId('dsc_message_display');
    const presence = byId('dsc_presence');
    const times = byId('dsc_times');
    const recentMax = byId('dsc_recent_max');

    enabled.checked = settings.enabled;
    appearance.value = settings.appearance;
    aside.checked = settings.aside;
    display.value = settings.messageDisplay;
    presence.checked = settings.presence;
    times.checked = settings.discordTimes;
    recentMax.value = String(settings.recentMax);

    const bind = (element, key, read, after) => {
        element.addEventListener('input', () => {
            settings[key] = read();
            applySettings();
            saveSettings();
            after?.();
        });
    };
    bind(enabled, 'enabled', () => enabled.checked);
    bind(appearance, 'appearance', () => appearance.value);
    bind(aside, 'aside', () => aside.checked);
    bind(display, 'messageDisplay', () => display.value);
    bind(presence, 'presence', () => presence.checked);
    bind(times, 'discordTimes', () => times.checked, () => labelMessages());
    bind(recentMax, 'recentMax', () => Math.min(500, Math.max(5, Number(recentMax.value) || defaultSettings.recentMax)), () => scheduleRefresh());
}

async function init() {
    applySettings();
    darkQuery.addEventListener('change', applySettings);
    initTooltips();

    const listLoaded = initData({ max: () => getSettings().recentMax, opened: showChat });
    initSidebar({ showFriends, openSwitcher, openSettings, showChat, showDiscover: openDiscover });
    initHeader({ toggleAside, openSwitcher, back });
    initSettings({ setTheme, isDark: () => isDark() });
    initSwitcher({ picked: () => document.body.classList.remove('dsc-friends') });
    initCompose();
    initEditor();
    initDiscover({ shown: () => { refreshHeader(); refreshTitle(); markCurrent(); } });
    createPhoneTabs();
    trackDrawers();
    initMessages();
    initMonograms();
    initShortcuts({
        enabled: () => !!getSettings().enabled,
        switcher: () => openSwitcher(''),
        settings: () => openSettings(''),
        conversation: stepConversation,
        server: stepServer,
        newChat: () => getCurrentPlace() && clickOption('option_start_new_chat'),
        newGroup: () => openCharacterPanel('rm_button_group_chats'),
        pin: togglePinCurrent,
        members: toggleAside,
        inbox: () => openInbox(),
        emoji: openExtensionsMenu,
    });
    applySettings();

    const { eventSource, eventTypes } = SillyTavern.getContext();
    eventSource.on(eventTypes.CHAT_CHANGED, onChatChanged);
    eventSource.on(eventTypes.GROUP_UPDATED, () => { refreshHeader(); refreshTitle(); });
    eventSource.on(eventTypes.CHARACTER_EDITED, refreshHeader);
    eventSource.on(eventTypes.CHARACTER_RENAMED, () => { refreshHeader(); refreshTitle(); });
    eventSource.on(eventTypes.PERSONA_CHANGED, refreshPersona);
    eventSource.on(eventTypes.PERSONA_RENAMED, () => refreshPersona());
    eventSource.on(eventTypes.SETTINGS_UPDATED, () => refreshPersona());
    onChatChanged(SillyTavern.getContext().getCurrentChatId());
    await Promise.race([listLoaded, delay(3000)]);
    endBoot();

    try {
        await renderSettingsPanel();
    } catch (error) {
        console.error('[Discord] Could not render the settings panel', error);
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/** Lifts the loading screen once the Discord UI has painted. */
function endBoot() {
    const body = document.body;
    if (!body.classList.contains('dsc-booting')) {
        return;
    }
    requestAnimationFrame(() => requestAnimationFrame(() => {
        body.classList.add('dsc-boot-done');
        setTimeout(() => {
            body.classList.remove('dsc-booting', 'dsc-boot-done');
            body.style.removeProperty('--dsc-boot-tip');
        }, 250);
    }));
}

/** Discord's loading screen from the moment this code loads (SillyTavern has its settings by then). */
function bootLook() {
    const settings = SillyTavern.getContext().extensionSettings?.[MODULE_NAME];
    if (settings?.enabled === false) {
        return;
    }
    document.body.classList.add('dsc-booting');
    // never leave the cover up if something fails on the way
    setTimeout(endBoot, 20000);
    applyThemeClasses({ ...defaultSettings, ...settings }, true);
    // the loading tip names this OS's key
    document.body.style.setProperty('--dsc-boot-tip', `'DID YOU KNOW\\A Press ${formatKeys(SHORTCUTS.switcher)} to jump to any conversation.'`);
}

bootLook();

const { eventSource, eventTypes } = SillyTavern.getContext();
eventSource.on(eventTypes.APP_READY, init);
