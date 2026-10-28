// Keeps the app's own name out of sight while the theme is on: the tab reads like a Discord
// tab with a plain blurple icon, and the message box says "Message @name" or
// "Message #channel". Turning the theme off puts the originals back.

import { channelLabel, getGroup } from './data.js';
import { t, toChannelName } from './ui.js';

const APP = 'Discord';
/** A plain blurple chat bubble, drawn here rather than borrowed from anyone's logo */
const ICON = `data:image/svg+xml,${encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='9' fill='#5865f2'/><path fill='#fff' d='M16 7.5c-5.2 0-9.3 3.4-9.3 7.7 0 2.3 1.2 4.3 3.1 5.7l-.6 3.6 3.9-2c.9.2 1.9.4 2.9.4 5.2 0 9.3-3.4 9.3-7.7S21.2 7.5 16 7.5zm-4 9.2a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm4 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm4 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z'/></svg>")}`;
const PLACEHOLDER_ATTRS = ['placeholder', 'connected_text', 'no_connection_text'];

let original = null;
let active = false;

function getIconLinks() {
    return [...document.querySelectorAll('link[rel~="icon"]')];
}

function remember() {
    if (original) {
        return;
    }
    const textarea = document.getElementById('send_textarea');
    original = {
        title: document.title,
        icons: getIconLinks().map(link => [link, link.getAttribute('href'), link.getAttribute('type')]),
        placeholder: Object.fromEntries(PLACEHOLDER_ATTRS.map(name => [name, textarea?.getAttribute(name)])),
    };
}

/** Where you are, the way Discord names it: "@Lyra", "#general" and its server, or Friends. */
function describe() {
    const context = SillyTavern.getContext();
    const group = context.groupId ? getGroup(context.groupId) : null;
    const character = !group && context.characterId !== undefined ? context.characters[context.characterId] : null;
    const chatId = context.getCurrentChatId();
    if (group && chatId) {
        return { title: [`#${toChannelName(channelLabel(group, chatId))}`, group.name], box: `#${toChannelName(channelLabel(group, chatId))}` };
    }
    if (character && chatId) {
        return { title: [`@${character.name}`], box: `@${character.name}` };
    }
    return { title: [t('Friends')], box: '' };
}

/** The tab title and message box text for where you are. */
export function refreshTitle() {
    if (!active) {
        return;
    }
    const where = describe();
    const friends = document.body.classList.contains('dsc-friends');
    document.title = [APP, ...(friends ? [t('Friends')] : where.title)].join(' | ');
    const textarea = document.getElementById('send_textarea');
    if (textarea) {
        const text = where.box ? `${t('Message')} ${where.box}` : t('Message');
        for (const name of PLACEHOLDER_ATTRS) {
            textarea.setAttribute(name, text);
        }
    }
}

export function setDisguise(enabled) {
    const textarea = document.getElementById('send_textarea');
    if (enabled) {
        remember();
        active = true;
        for (const link of getIconLinks()) {
            link.setAttribute('href', ICON);
            link.setAttribute('type', 'image/svg+xml');
        }
        refreshTitle();
        return;
    }
    if (!active || !original) {
        return;
    }
    active = false;
    document.title = original.title;
    for (const [link, href, type] of original.icons) {
        link.setAttribute('href', href);
        if (type) {
            link.setAttribute('type', type);
        } else {
            link.removeAttribute('type');
        }
    }
    if (textarea) {
        for (const name of PLACEHOLDER_ATTRS) {
            const value = original.placeholder[name];
            if (value === null || value === undefined) {
                textarea.removeAttribute(name);
            } else {
                textarea.setAttribute(name, value);
            }
        }
        // SillyTavern's own text for the current connection state
        const connected = !document.getElementById('send_form')?.classList.contains('no-connection');
        textarea.setAttribute('placeholder', textarea.getAttribute(connected ? 'connected_text' : 'no_connection_text') ?? '');
    }
    original = null;
}
