// Connections, as Discord's page: a card for the connection in use (logo, provider, model,
// status) and the providers as logo tiles to pick from, the way Discord lists the accounts you
// can connect. Tiles come from SillyTavern's own lists (API, Chat Completion source, Text
// Completion type) and pick through them, so SillyTavern's own form below (key, address,
// model, Connect) follows. The logos are the ones SillyTavern ships in /img.

import { getInitials, t } from './ui.js';

const ROOT_ID = 'dsc-conn';

/** SillyTavern's select for each tile group, in order. */
const GROUPS = [
    { select: 'main_api', title: 'API' },
    { select: 'chat_completion_source', title: 'Chat Completion Provider', when: () => value('main_api') === 'openai' },
    { select: 'textgen_type', title: 'Text Completion Backend', when: () => value('main_api') === 'textgenerationwebui' },
];

function select(id) {
    return /** @type {HTMLSelectElement|null} */ (document.getElementById(id));
}

function value(id) {
    return select(id)?.value ?? '';
}

function label(id) {
    const element = select(id);
    return element?.selectedOptions?.[0]?.textContent?.trim() ?? '';
}

/** The provider in use: the deepest choice that applies. */
function current() {
    const api = value('main_api');
    if (api === 'openai') {
        return { key: value('chat_completion_source'), name: label('chat_completion_source'), kind: label('main_api') };
    }
    if (api === 'textgenerationwebui') {
        return { key: value('textgen_type'), name: label('textgen_type').replace(/\s*\[.*\]$/, ''), kind: label('main_api') };
    }
    return { key: api, name: label('main_api'), kind: t('API') };
}

/** SillyTavern's provider logos, fetched once each and inlined so they take the text colour
    (several rely on the page for their fill and draw nothing as plain images). */
const logos = new Map();

function loadLogo(key) {
    if (!logos.has(key)) {
        logos.set(key, fetch(`/img/${encodeURIComponent(key)}.svg`)
            .then(response => (response.ok && /svg/.test(response.headers.get('content-type') ?? '') ? response.text() : ''))
            .then(text => (text ? SillyTavern.libs.DOMPurify.sanitize(text, { USE_PROFILES: { svg: true, svgFilters: true } }) : ''))
            .catch(() => ''));
    }
    return logos.get(key);
}

function logo(key, name) {
    const box = document.createElement('span');
    box.className = 'dsc-conn-logo';
    box.textContent = getInitials(name.replace(/\(.*?\)|\[.*?\]/g, '')).slice(0, 2);
    loadLogo(key).then((svg) => {
        if (svg) {
            box.innerHTML = svg;
            const element = box.querySelector('svg');
            element?.removeAttribute('width');
            element?.removeAttribute('height');
        }
    });
    return box;
}

function pick(id, optionValue) {
    const element = select(id);
    if (!element || element.value === optionValue) {
        return;
    }
    element.value = optionValue;
    // SillyTavern listens with jQuery; a bubbling change event reaches it
    element.dispatchEvent(new Event('change', { bubbles: true }));
    setTimeout(render, 0);
}

function statusCard() {
    const { onlineStatus } = SillyTavern.getContext();
    const connected = !!onlineStatus && onlineStatus !== 'no_connection';
    const { key, name, kind } = current();
    const card = document.createElement('div');
    card.className = 'dsc-conn-card';
    card.classList.toggle('dsc-connected', connected);
    const text = document.createElement('div');
    text.className = 'dsc-conn-text';
    const title = document.createElement('b');
    title.textContent = name;
    const sub = document.createElement('small');
    sub.textContent = kind;
    const status = document.createElement('span');
    status.className = 'dsc-conn-status';
    // the status is the model's name once connected (or just "Connected" for some APIs)
    const model = connected && !/^connected\b/i.test(String(onlineStatus)) ? ` · ${onlineStatus}` : '';
    status.textContent = connected ? `${t('Connected')}${model}` : t('Not connected');
    text.append(title, sub, status);
    card.append(logo(key, name), text);
    return card;
}

function tiles(group) {
    const element = select(group.select);
    if (!element || (group.when && !group.when())) {
        return null;
    }
    const section = document.createElement('section');
    section.className = 'dsc-conn-group';
    const heading = document.createElement('h3');
    heading.textContent = t(group.title);
    const grid = document.createElement('div');
    grid.className = 'dsc-conn-tiles';
    for (const option of element.options) {
        if (!option.value || option.disabled || option.hidden) {
            continue;
        }
        const name = option.textContent.trim().replace(/\s*\[.*\]$/, '');
        const tile = document.createElement('button');
        tile.type = 'button';
        tile.className = 'dsc-conn-tile';
        tile.classList.toggle('dsc-selected', option.value === element.value);
        tile.setAttribute('aria-pressed', String(option.value === element.value));
        tile.title = option.textContent.trim();
        const caption = document.createElement('span');
        caption.textContent = name;
        tile.append(logo(option.value, name), caption);
        tile.addEventListener('click', () => pick(group.select, option.value));
        grid.append(tile);
    }
    section.append(heading, grid);
    return section;
}

export function render() {
    const block = document.getElementById('rm_api_block');
    if (!block) {
        return;
    }
    let root = document.getElementById(ROOT_ID);
    if (!root) {
        root = document.createElement('div');
        root.id = ROOT_ID;
        block.querySelector(':scope > #title_api')?.after(root) ?? block.prepend(root);
    }
    root.replaceChildren(statusCard(), ...GROUPS.map(tiles).filter(Boolean));
}

export function initConnections() {
    render();
    for (const id of GROUPS.map(x => x.select)) {
        select(id)?.addEventListener('change', () => setTimeout(render, 0));
    }
    const { eventSource, eventTypes } = SillyTavern.getContext();
    for (const type of [eventTypes.ONLINE_STATUS_CHANGED, eventTypes.CHATCOMPLETION_SOURCE_CHANGED, eventTypes.MAIN_API_CHANGED, eventTypes.SETTINGS_LOADED_AFTER].filter(Boolean)) {
        eventSource.on(type, () => setTimeout(render, 0));
    }
}
