// Discord's keyboard shortcuts, written the way each OS writes them ("Ctrl+K" on Windows and
// Linux, "⌘K" on macOS). Tooltips show them, they work, and Ctrl+/ / ⌘/ lists them all, as
// Discord's Keybinds popup does.

import { escapeHtml, t } from './ui.js';

export const IS_MAC = /Mac|iPhone|iPad|iPod/i.test(navigator.userAgentData?.platform || navigator.platform || navigator.userAgent);

const MAC_KEYS = { Mod: '⌘', Shift: '⇧', Alt: '⌥', Ctrl: '⌃', Enter: '↩', Up: '↑', Down: '↓', Esc: 'Esc', '/': '/', ',': ',', "'": "'" };
const PC_KEYS = { Mod: 'Ctrl', Shift: 'Shift', Alt: 'Alt', Ctrl: 'Ctrl', Enter: 'Enter', Up: 'Up', Down: 'Down', Esc: 'Esc', '/': '/', ',': ',', "'": "'" };

export const SHORTCUTS = {
    switcher: ['Mod', 'K'],
    search: ['Mod', 'F'],
    keybinds: ['Mod', '/'],
    settings: ['Mod', ','],
    previousConversation: ['Alt', 'Up'],
    nextConversation: ['Alt', 'Down'],
    previousServer: ['Mod', 'Alt', 'Up'],
    nextServer: ['Mod', 'Alt', 'Down'],
    newChat: ['Mod', "'"],
    newGroup: ['Mod', 'Shift', 'T'],
    pin: ['Mod', 'P'],
    members: ['Mod', 'U'],
    inbox: ['Mod', 'I'],
    emoji: ['Mod', 'E'],
    mute: ['Mod', 'Shift', 'M'],
    deafen: ['Mod', 'Shift', 'D'],
};

/** Writes a shortcut the way this OS does: ⌘K on a Mac, Ctrl+K elsewhere. */
export function formatKeys(keys) {
    if (IS_MAC) {
        return keys.map(key => MAC_KEYS[key] ?? key.toUpperCase()).join('');
    }
    return keys.map(key => PC_KEYS[key] ?? key.toUpperCase()).join('+');
}

/** "Label (shortcut)" */
export function withShortcut(label, keys) {
    return `${label} (${formatKeys(keys)})`;
}

function matches(event, keys) {
    const wantMod = keys.includes('Mod');
    const mod = IS_MAC ? event.metaKey : event.ctrlKey;
    const otherMod = IS_MAC ? event.ctrlKey : event.metaKey;
    if (mod !== wantMod || otherMod || event.shiftKey !== keys.includes('Shift') || event.altKey !== keys.includes('Alt')) {
        return false;
    }
    const key = keys[keys.length - 1];
    if (key === 'Up' || key === 'Down') {
        return event.key === `Arrow${key}`;
    }
    if (key === '/') {
        return event.code === 'Slash';
    }
    if (key === ',') {
        return event.code === 'Comma';
    }
    if (key === "'") {
        return event.code === 'Quote';
    }
    return event.code === `Key${key}`;
}

function isTyping(target) {
    return target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
}

/** Every shortcut, by group, as Discord's Keybinds page lists them. */
export function shortcutGroups() {
    return [
        ['Navigation', [
            ['Quick Switcher', SHORTCUTS.switcher],
            ['Search', SHORTCUTS.search],
            ['Navigate Channels', ['Alt', 'Up']],
            ['Navigate Servers', ['Mod', 'Alt', 'Up']],
            ['Chat History', SHORTCUTS.inbox],
            ['User Settings', SHORTCUTS.settings],
            ['Toggle Hotkeys', SHORTCUTS.keybinds],
        ]],
        ['Chat', [
            ['Send a Message', ['Enter']],
            ['New Line', ['Shift', 'Enter']],
            ['Edit Your Last Message', ['Up']],
            ['Emoji Picker', SHORTCUTS.emoji],
            ['Start a New Chat', SHORTCUTS.newChat],
            ['Create a Group', SHORTCUTS.newGroup],
            ['Pin or Unpin the Chat', SHORTCUTS.pin],
            ['Toggle Member List', SHORTCUTS.members],
        ]],
        ['Voice', [
            ['Toggle Mute', SHORTCUTS.mute],
            ['Toggle Deafen', SHORTCUTS.deafen],
        ]],
        ['Everywhere', [
            ['Close a Menu or Dialog', ['Esc']],
        ]],
    ];
}

/** One shortcut's keys as Discord's key chips. */
export function keysHtml(keys) {
    return keys.map(key => `<kbd>${escapeHtml(formatKeys([key]))}</kbd>`).join('');
}

/** Discord's Keybinds list, as a popup (Ctrl/⌘+/). */
export async function showShortcuts() {
    const { callGenericPopup, POPUP_TYPE } = SillyTavern.getContext();
    const rows = items => items.map(([label, keys]) => `<div class="dsc-kb-row"><span>${escapeHtml(t(label))}</span><span class="dsc-kb-keys">${keysHtml(keys)}</span></div>`).join('');
    const html = `<div class="dsc-keybinds">
        <h3>${escapeHtml(t('Keyboard Combos'))}</h3>
        <div class="dsc-kb-grid">
            ${rows(shortcutGroups().flatMap(([, items]) => items))}
        </div>
    </div>`;
    await callGenericPopup(html, POPUP_TYPE.TEXT, '', { wide: true, allowVerticalScrolling: true });
}

/**
 * @param {object} actions
 * @param {() => boolean} actions.enabled Whether the theme is on
 * @param {() => void} actions.switcher
 * @param {() => void} actions.settings
 * @param {(step: number) => void} actions.conversation
 * @param {(step: number) => void} actions.server
 * @param {() => void} actions.newChat
 * @param {() => void} actions.newGroup
 * @param {() => void} actions.pin
 * @param {() => void} actions.members
 * @param {() => void} actions.inbox
 * @param {() => void} actions.emoji
 */
export function initShortcuts(actions) {
    document.addEventListener('keydown', (event) => {
        if (!actions.enabled() || event.repeat) {
            return;
        }
        const run = [
            [SHORTCUTS.switcher, actions.switcher],
            [SHORTCUTS.keybinds, showShortcuts],
            [SHORTCUTS.settings, actions.settings],
            [SHORTCUTS.previousServer, () => actions.server(-1)],
            [SHORTCUTS.nextServer, () => actions.server(1)],
            [SHORTCUTS.previousConversation, () => actions.conversation(-1)],
            [SHORTCUTS.nextConversation, () => actions.conversation(1)],
            [SHORTCUTS.newChat, actions.newChat],
            [SHORTCUTS.newGroup, actions.newGroup],
            [SHORTCUTS.pin, actions.pin],
            [SHORTCUTS.members, actions.members],
            [SHORTCUTS.inbox, actions.inbox],
            [SHORTCUTS.emoji, actions.emoji],
            // your panel's mute and deafen, as Discord's Ctrl/⌘+Shift+M and D
            [SHORTCUTS.mute, () => /** @type {HTMLElement} */ (document.querySelector('#dsc-user .dsc-mute'))?.click()],
            [SHORTCUTS.deafen, () => /** @type {HTMLElement} */ (document.querySelector('#dsc-user .dsc-deafen'))?.click()],
        ].find(([keys]) => matches(event, keys))?.[1];
        if (!run) {
            return;
        }
        // Alt+arrows move the caret in text, so only take them outside text boxes (except the message box when empty)
        const altArrows = event.altKey && !event.metaKey && !event.ctrlKey && /^Arrow(Up|Down)$/.test(event.key);
        if (altArrows && isTyping(event.target) && /** @type {HTMLTextAreaElement} */ (event.target).value) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        run();
    }, true);
}
