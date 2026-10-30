// Discord's Quick Switcher (Ctrl+K / ⌘K): one box to jump to anyone, any channel or any
// server. Start with @, # or * to look only at people, channels or servers.

import { getChannels, getDirectMessages, getServers, openCharacter, openPlace } from './data.js';
import { monogramizeAll } from './monograms.js';
import { selectServer } from './sidebar.js';
import { closeDrawers, getAcronym, icon, serverPicture, shieldFromOutsideClose, t, toChannelName } from './ui.js';

const ID = 'dsc-switcher';
const LIMIT = 12;

let results = [];
let index = 0;
let onPicked = () => {};

function build() {
    let root = document.getElementById(ID);
    if (root) {
        return root;
    }
    root = document.createElement('div');
    root.id = ID;
    root.hidden = true;
    root.addEventListener('pointerdown', (event) => {
        if (event.target === root) {
            closeSwitcher();
        }
    });
    const box = document.createElement('div');
    box.className = 'dsc-sw-box';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', t('Quick Switcher'));
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'dsc-sw-input';
    input.placeholder = t('Where would you like to go?');
    input.autocomplete = 'off';
    input.spellcheck = false;
    input.addEventListener('input', () => search(input.value));
    input.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            move(event.key === 'ArrowDown' ? 1 : -1);
        } else if (event.key === 'Enter') {
            event.preventDefault();
            pick(index);
        } else if (event.key === 'Escape') {
            event.preventDefault();
            event.stopPropagation();
            closeSwitcher();
        }
    });
    const list = document.createElement('div');
    list.className = 'dsc-sw-list';
    list.setAttribute('role', 'listbox');
    list.addEventListener('click', (event) => {
        const row = /** @type {HTMLElement} */ (event.target).closest('.dsc-sw-row');
        if (row) {
            pick(Number(row.dataset.index));
        }
    });
    list.addEventListener('pointermove', (event) => {
        const row = /** @type {HTMLElement} */ (event.target).closest('.dsc-sw-row');
        if (row && Number(row.dataset.index) !== index) {
            index = Number(row.dataset.index);
            mark();
        }
    });
    const tip = document.createElement('div');
    tip.className = 'dsc-sw-tip';
    const strong = document.createElement('strong');
    strong.textContent = t('PROTIP:');
    tip.append(strong, ` ${t('Start searches with @, # or * to narrow down results.')}`);
    box.append(input, list, tip);
    root.append(box);
    document.body.append(root);
    shieldFromOutsideClose(root);
    return root;
}

function everything() {
    const context = SillyTavern.getContext();
    const { getThumbnailUrl } = context;
    const items = [];
    const recentAvatars = new Map(getDirectMessages().map((dm, i) => [dm.avatar, i]));
    for (const character of context.characters) {
        items.push({
            kind: '@', name: character.name, hint: '', rank: recentAvatars.get(character.avatar) ?? 9999,
            thumb: getThumbnailUrl('avatar', character.avatar), run: () => openCharacter(character.avatar),
        });
    }
    for (const group of getServers()) {
        items.push({ kind: '*', name: group.name, hint: '', rank: 5000, acronym: getAcronym(group.name), group, run: () => selectServer(String(group.id), true) });
        for (const channel of getChannels(group)) {
            items.push({ kind: '#', name: toChannelName(channel.name), hint: group.name, rank: 6000, run: () => openPlace(channel) });
        }
    }
    return items;
}

function search(text) {
    const raw = String(text ?? '');
    const kind = /^[@#*]/.test(raw) ? raw[0] : '';
    const needle = (kind ? raw.slice(1) : raw).trim().toLowerCase();
    let items = everything().filter(item => !kind || item.kind === kind);
    if (needle) {
        items = items
            .map((item) => {
                const name = item.name.toLowerCase();
                const at = name.indexOf(needle);
                const score = at === 0 ? 0 : at > 0 ? 1 : (item.hint.toLowerCase().includes(needle) ? 2 : -1);
                return { item, score };
            })
            .filter(x => x.score >= 0)
            .sort((a, b) => a.score - b.score || a.item.rank - b.item.rank || a.item.name.localeCompare(b.item.name))
            .map(x => x.item);
    } else {
        items.sort((a, b) => a.rank - b.rank);
    }
    results = items.slice(0, LIMIT);
    index = 0;
    render(needle || kind ? '' : t('Previous Channels'));
}

function render(heading) {
    const list = document.querySelector(`#${ID} .dsc-sw-list`);
    const rows = [];
    if (heading && results.length) {
        const h = document.createElement('h3');
        h.className = 'dsc-sw-heading';
        h.textContent = heading;
        rows.push(h);
    }
    results.forEach((item, i) => {
        const row = document.createElement('div');
        row.className = 'dsc-sw-row';
        row.setAttribute('role', 'option');
        row.dataset.index = String(i);
        if (item.kind === '@') {
            const avatar = document.createElement('span');
            avatar.className = 'dsc-avatar';
            avatar.dataset.name = item.name;
            const img = document.createElement('img');
            img.alt = '';
            img.loading = 'lazy';
            img.src = item.thumb;
            avatar.append(img);
            row.append(avatar);
        } else if (item.kind === '*') {
            const acronym = document.createElement('span');
            acronym.className = 'dsc-sw-acronym';
            const picture = serverPicture(item.group);
            if (picture) {
                acronym.append(picture);
            } else {
                acronym.textContent = item.acronym;
            }
            row.append(acronym);
        } else {
            row.append(icon('hash', 20));
        }
        const name = document.createElement('span');
        name.className = 'dsc-sw-name';
        name.textContent = item.name;
        row.append(name);
        if (item.hint) {
            const hint = document.createElement('span');
            hint.className = 'dsc-sw-hint';
            hint.textContent = item.hint;
            row.append(hint);
        }
        rows.push(row);
    });
    if (!results.length) {
        const empty = document.createElement('div');
        empty.className = 'dsc-sw-empty';
        empty.textContent = t('Can\'t find what you\'re looking for?');
        rows.push(empty);
    }
    list.replaceChildren(...rows);
    monogramizeAll(list, '.dsc-avatar img', img => img.parentElement?.dataset.name ?? '');
    mark();
}

function mark() {
    document.querySelectorAll(`#${ID} .dsc-sw-row`).forEach((row) => {
        const on = Number(/** @type {HTMLElement} */ (row).dataset.index) === index;
        row.classList.toggle('dsc-selected', on);
        row.setAttribute('aria-selected', String(on));
        if (on) {
            row.scrollIntoView({ block: 'nearest' });
        }
    });
}

function move(step) {
    if (!results.length) {
        return;
    }
    index = (index + step + results.length) % results.length;
    mark();
}

function pick(i) {
    const item = results[i];
    if (!item) {
        return;
    }
    closeSwitcher();
    closeDrawers();
    onPicked();
    item.run();
}

function closeSwitcher() {
    const root = document.getElementById(ID);
    if (root) {
        root.hidden = true;
    }
}

export function openSwitcher(text = '') {
    const root = build();
    if (!root.hidden) {
        closeSwitcher();
        return;
    }
    root.hidden = false;
    const input = /** @type {HTMLInputElement} */ (root.querySelector('.dsc-sw-input'));
    input.value = text;
    search(text);
    input.focus();
}

/** @param {{picked: () => void}} options */
export function initSwitcher(options) {
    onPicked = options.picked;
}
