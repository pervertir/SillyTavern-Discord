// Discord theme: toggles the scoped styles in style.css, builds the Discord frame (server
// rail, conversation list, your panel, chat header, profile panel, Friends page, settings
// and quick switcher) and exposes a small settings panel.

import { initAttachments } from './attachments.js';
import { initCompose, openEmojiFromShortcut } from './compose.js';
import { initConnections } from './connections.js';
import { initCustomize } from './customize.js';
import { registerTheme } from './lib/theme-exclusive.js';
import { initExtras } from './extras.js';
import { initForms } from './forms.js';
import { buildGated, teardown } from './life.js';
import { initPages } from './pages.js';
import { initEmbeds } from './embeds.js';
import { initAppearance, renderAppearance } from './appearance.js';
import { hideDiscover, initDiscover, showDiscover } from './discover.js';
import { applyNitroTheme, getNitroTheme, NITRO_THEMES } from './nitro.js';
import { initEditor, refreshEditor } from './editor.js';
import { getCurrentPlace, initData, scheduleRefresh } from './data.js';
import { refreshTitle, setDisguise } from './disguise.js';
import { initHeader, openInbox, refreshHeader, refreshPresenceViews, setFriendsTab, togglePinCurrent } from './header.js';
import { enableDesktopNotifications, initNotify } from './notify.js';
import { initOverlays } from './overlays.js';
import { initPresence } from './presence.js';
import { initReactions } from './reactions.js';
import { initSounds, play } from './sounds.js';
import { initSplit, renderAllParts } from './split.js';
import { initMessages, labelMessages, setClock } from './messages.js';
import { initMessageTools } from './msgtools.js';
import { initMonograms } from './monograms.js';
import { initSettings, openSettings, refreshSettings, SETTINGS_DRAWERS } from './settings.js';
import { formatKeys, initShortcuts, SHORTCUTS } from './shortcuts.js';
import { initSidebar, markCurrent, openCharacterPanel, refreshPersona, stepConversation, stepServer } from './sidebar.js';
import { initSwitcher, openSwitcher } from './switcher.js';
import { clickOption, closeDrawers, initTooltips, isPhone, t } from './ui.js';

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
    /** A Nitro color theme (nitro.js id), or '' for none; it brings its own light or dark base */
    nitroTheme: '',
    /** The profile panel in DMs and the member list in servers */
    aside: true,
    /** cozy (pictures and names) or compact (one line per message) */
    messageDisplay: 'cozy',
    /** Green "online" dots on everyone */
    presence: true,
    /** "Today at 4:20 PM" in place of SillyTavern's long dates */
    discordTimes: true,
    /** Characters come and go online; a reply to someone away waits for them to come online */
    presenceSim: true,
    /** Seconds before someone away comes online to reply */
    wakeDelay: 3,
    /** Sounds, as Discord's Notifications > Sounds: all on or off, volume 0-100, and each kind */
    sounds: true,
    soundVolume: 60,
    soundMessage: true,
    /** Ping for replies in the chat you're looking at too (Discord doesn't) */
    soundAlways: false,
    soundOnline: true,
    soundVoice: true,
    /** The user panel's mute and deafen */
    muted: false,
    deafened: false,
    /** Message text size in px, and the gap between message groups in px */
    chatFont: 16,
    groupGap: 16,
    /** 24-hour clock in message times */
    clock24: false,
    /** SillyTavern's chat background behind the messages (hidden by default, as Discord has none) */
    showBackground: false,
    /** Image links in messages show as pictures (even with SillyTavern's Forbid External Media on) */
    showImageLinks: true,
    /** Long replies show as several short messages */
    splitReplies: true,
    /** Your own status: online, idle, dnd or invisible */
    myStatus: 'online',
    /** Desktop notifications for replies that arrive while the window isn't in front */
    desktopNotifications: false,
    recentMax: 50,
    /** SillyTavern's UI theme preset and Custom CSS are paused while the theme is on */
    pauseUserTheme: true,
});

/** One theme at a time (lib/theme-exclusive.js, shared with the other themes) */
let exclusive = { activated: () => {}, changed: () => {} };

/** The theme was built on this page, and taken down again since */
let started = false;
let tornDown = false;

/** Builds the theme (the first time), or brings it back after it was taken down. */
function turnOn() {
    if (!started) {
        start();
    } else if (tornDown) {
        // its handlers are already registered on this page: a reload builds it cleanly, once
        // the setting is saved
        toastr.info(t('Turning the Discord theme on…'));
        setTimeout(() => location.reload(), 1500);
    }
}

/** Takes everything of the theme out of SillyTavern's page. */
function turnOff() {
    if (started && !tornDown) {
        tornDown = true;
        teardown();
    }
}

/** Turns the theme on or off live, as its toggle does. */
function setEnabled(on) {
    getSettings().enabled = on;
    applySettings();
    saveSettings();
    const toggle = /** @type {HTMLInputElement} */ (document.getElementById('dsc_enabled'));
    if (toggle) {
        toggle.checked = on;
    }
    if (on) {
        turnOn();
    } else {
        turnOff();
    }
}

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
    const nitro = on ? getNitroTheme(settings.nitroTheme) : null;
    const dark = nitro ? nitro.base === 'dark' : isDark(settings);
    body.toggle('dsc-light', on && !dark);
    body.toggle('dsc-ash', on && !nitro && dark && settings.appearance === 'ash');
    body.toggle('dsc-onyx', on && !nitro && dark && settings.appearance === 'onyx');
    applyNitroTheme(nitro);
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
    body.toggle('dsc-show-bg', on && !!settings.showBackground);
    if (on) {
        document.body.style.setProperty('--dsc-chat-font', `${Number(settings.chatFont) || 16}px`);
        document.body.style.setProperty('--dsc-group-gap', `${Number.isFinite(Number(settings.groupGap)) ? Number(settings.groupGap) : 16}px`);
    } else {
        document.body.style.removeProperty('--dsc-chat-font');
        document.body.style.removeProperty('--dsc-group-gap');
    }
    setDisguise(on);
    refreshHeader();
}

/** Picks a base theme (Light, Ash, Dark, Onyx, Sync); a Nitro color theme gives way to it. */
function setTheme(appearance) {
    const settings = getSettings();
    settings.appearance = appearance;
    settings.nitroTheme = '';
    applySettings();
    saveSettings();
    syncThemeFields();
}

/** Picks a Nitro color theme. */
function setNitroTheme(id) {
    const settings = getSettings();
    settings.nitroTheme = getNitroTheme(id) ? id : '';
    applySettings();
    saveSettings();
    syncThemeFields();
}

/** Shows the current choice in the extension's panel and on the Appearance page. */
function syncThemeFields() {
    const settings = getSettings();
    const select = /** @type {HTMLSelectElement} */ (document.getElementById('dsc_appearance'));
    if (select) {
        select.value = settings.appearance;
    }
    const nitro = /** @type {HTMLSelectElement} */ (document.getElementById('dsc_nitro'));
    if (nitro) {
        nitro.value = settings.nitroTheme;
    }
    renderAppearance();
}

/** Opens the profile panel / member list if it's hidden. */
function showAside() {
    if (!getSettings().aside) {
        toggleAside();
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
        // moving between sections closes one menu before the next opens: the settings stay
        // up through that gap (settings.js marks it) so the chat never flashes through
        if (settings) {
            body.remove('dsc-settings-switching');
        }
        settings ||= body.contains('dsc-settings-switching') || body.contains('dsc-settings-page');
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
    trackDrawers.update = update;
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
    const pauseUserTheme = byId('dsc_pause_user_theme');
    const appearance = byId('dsc_appearance');
    const nitro = /** @type {HTMLSelectElement} */ (document.getElementById('dsc_nitro'));
    for (const theme of NITRO_THEMES) {
        nitro.append(new Option(theme.name, theme.id));
    }
    const aside = byId('dsc_aside');
    const display = byId('dsc_message_display');
    const presence = byId('dsc_presence');
    const times = byId('dsc_times');
    const recentMax = byId('dsc_recent_max');
    const presenceSim = byId('dsc_presence_sim');
    const sounds = byId('dsc_sounds');
    const desktop = byId('dsc_desktop_notifications');
    const split = byId('dsc_split');
    const showBackground = byId('dsc_show_bg');
    const imageLinks = byId('dsc_image_links');
    const soundVolume = byId('dsc_sound_volume');
    const soundMessage = byId('dsc_sound_message');
    const soundOnline = byId('dsc_sound_online');
    const soundAlways = byId('dsc_sound_always');
    const soundVoice = byId('dsc_sound_voice');
    const wakeDelay = byId('dsc_wake_delay');

    enabled.checked = settings.enabled;
    pauseUserTheme.checked = settings.pauseUserTheme !== false;
    appearance.value = settings.appearance;
    nitro.value = settings.nitroTheme;
    aside.checked = settings.aside;
    display.value = settings.messageDisplay;
    presence.checked = settings.presence;
    times.checked = settings.discordTimes;
    recentMax.value = String(settings.recentMax);
    presenceSim.checked = settings.presenceSim;
    sounds.checked = settings.sounds;
    desktop.checked = settings.desktopNotifications;
    split.checked = settings.splitReplies;
    showBackground.checked = settings.showBackground;
    imageLinks.checked = settings.showImageLinks;
    soundVolume.value = String(settings.soundVolume);
    soundMessage.checked = settings.soundMessage;
    soundOnline.checked = settings.soundOnline;
    soundAlways.checked = settings.soundAlways;
    soundVoice.checked = settings.soundVoice;
    wakeDelay.value = String(settings.wakeDelay);

    const bind = (element, key, read, after) => {
        element.addEventListener('input', () => {
            settings[key] = read();
            applySettings();
            saveSettings();
            after?.();
        });
    };
    bind(enabled, 'enabled', () => enabled.checked, () => {
        if (enabled.checked) {
            exclusive.activated();
            turnOn();
        } else {
            exclusive.changed();
            turnOff();
        }
    });
    bind(pauseUserTheme, 'pauseUserTheme', () => pauseUserTheme.checked, () => exclusive.changed());
    bind(appearance, 'appearance', () => appearance.value, () => setTheme(appearance.value));
    bind(nitro, 'nitroTheme', () => nitro.value, () => syncThemeFields());
    bind(aside, 'aside', () => aside.checked);
    bind(display, 'messageDisplay', () => display.value);
    bind(presence, 'presence', () => presence.checked);
    bind(times, 'discordTimes', () => times.checked, () => labelMessages());
    bind(sounds, 'sounds', () => sounds.checked);
    bind(showBackground, 'showBackground', () => showBackground.checked);
    // pictures in or out takes a fresh draw of the chat
    bind(imageLinks, 'showImageLinks', () => imageLinks.checked, () => SillyTavern.getContext().reloadCurrentChat());
    bind(split, 'splitReplies', () => split.checked, () => renderAllParts());
    // turning desktop notifications on asks the browser first
    desktop.addEventListener('input', async () => {
        settings.desktopNotifications = desktop.checked && await enableDesktopNotifications();
        desktop.checked = settings.desktopNotifications;
    split.checked = settings.splitReplies;
    showBackground.checked = settings.showBackground;
    imageLinks.checked = settings.showImageLinks;
        saveSettings();
    });
    bind(soundVolume, 'soundVolume', () => Number(soundVolume.value), () => play('message'));
    bind(soundMessage, 'soundMessage', () => soundMessage.checked);
    bind(soundOnline, 'soundOnline', () => soundOnline.checked);
    bind(soundAlways, 'soundAlways', () => soundAlways.checked);
    bind(soundVoice, 'soundVoice', () => soundVoice.checked);
    bind(presenceSim, 'presenceSim', () => presenceSim.checked, () => refreshPresenceViews());
    bind(wakeDelay, 'wakeDelay', () => Math.min(30, Math.max(0, Number(wakeDelay.value) || 0)));
    bind(recentMax, 'recentMax', () => Math.min(500, Math.max(5, Number(recentMax.value) || defaultSettings.recentMax)), () => scheduleRefresh());
}

async function init() {
    applySettings();
    exclusive = registerTheme({
        id: 'discord',
        name: 'Discord',
        folder: 'SillyTavern-Discord',
        settingsKey: MODULE_NAME,
        bodyClass: BODY_CLASS,
        isEnabled: () => !!getSettings().enabled,
        disable: () => setEnabled(false),
        pauseUserTheme: () => getSettings().pauseUserTheme !== false,
    });
    if (getSettings().enabled) {
        await start();
    }

    try {
        await renderSettingsPanel();
    } catch (error) {
        console.error('[Discord] Could not render the settings panel', error);
    }
}

/** Builds the theme: every handler registered here does nothing while it's off (life.js). */
async function start() {
    if (started) {
        return;
    }
    started = true;
    let listLoaded = Promise.resolve();
    buildGated(() => !!getSettings().enabled, () => {
        darkQuery.addEventListener('change', applySettings);
        initTooltips();

        listLoaded = initData({ max: () => getSettings().recentMax, opened: showChat });
        initSidebar({ showFriends, openSwitcher, openSettings, showChat, showDiscover: openDiscover });
        initHeader({ showAside, toggleAside, openSwitcher, back });
        initCustomize({ settings: getSettings, save: saveSettings });
        initPages({ settings: getSettings, save: saveSettings, play, enableDesktop: enableDesktopNotifications });
        initSettings({ setTheme, isDark: () => isDark(), drawersChanged: () => trackDrawers.update?.() });
        initSwitcher({ picked: () => document.body.classList.remove('dsc-friends') });
        initCompose();
        initEditor();
        initAppearance({
            current: () => ({ appearance: getSettings().appearance, nitroTheme: getSettings().nitroTheme }),
            setBase: setTheme,
            setNitro: setNitroTheme,
            get: key => getSettings()[key],
            set: (key, value) => {
                getSettings()[key] = value;
                applySettings();
                saveSettings();
                if (key === 'clock24') {
                    labelMessages();
                }
                if (key === 'messageDisplay') {
                    const select = /** @type {HTMLSelectElement} */ (document.getElementById('dsc_message_display'));
                    if (select) {
                        select.value = value;
                    }
                }
            },
        });
        initDiscover({ shown: () => { refreshHeader(); refreshTitle(); markCurrent(); } });
        createPhoneTabs();
        trackDrawers();
        setClock(() => !!getSettings().clock24);
        initMessages();
        initMessageTools();
        initReactions();
        initExtras();
        initAttachments();
        initForms();
        initConnections();
        initOverlays({ connections: () => openSettings('sys-settings-button') });
        initEmbeds({ enabled: () => !!getSettings().enabled && !!getSettings().showImageLinks });
        initSplit({
            enabled: () => !!getSettings().enabled && !!getSettings().splitReplies,
            paced: () => !!getSettings().presenceSim,
        });
        initSounds({ settings: getSettings, save: saveSettings });
        initNotify({ settings: getSettings, save: saveSettings, openSettings });
        initPresence({
            enabled: () => !!getSettings().enabled && !!getSettings().presenceSim,
            delay: () => getSettings().wakeDelay,
            changed: refreshPresenceViews,
        });
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
            emoji: openEmojiFromShortcut,
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
    });
    onChatChanged(SillyTavern.getContext().getCurrentChatId());
    await Promise.race([listLoaded, delay(3000)]);
    endBoot();
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
