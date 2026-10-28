// The character and group editors as Discord's full-screen settings: a character opens like
// your Profile page, a group like Server Settings, with a sidebar of their sections and the
// round close button. The editors themselves are SillyTavern's, placed in the page's spot;
// the sidebar's items scroll to their parts or press SillyTavern's own buttons.

import { closeDrawers, icon, t } from './ui.js';

const ID = 'dsc-editor';

/** Which editor the character panel shows: '' (the list), 'char' or 'group' */
let mode = '';

function visible(id) {
    const element = document.getElementById(id);
    return !!element && element.style.display !== 'none' && getComputedStyle(element).display !== 'none';
}

function press(id) {
    document.getElementById(id)?.click();
}

function scrollTo(id) {
    const target = document.getElementById(id);
    const panel = document.getElementById('right-nav-panel');
    if (target && panel) {
        panel.scrollTo({ top: Math.max(0, target.offsetTop - 16), behavior: 'smooth' });
    } else {
        panel?.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function currentName() {
    const context = SillyTavern.getContext();
    if (mode === 'group') {
        const group = context.groupId ? context.groups.find(x => String(x.id) === String(context.groupId)) : null;
        return group?.name ?? '';
    }
    const name = /** @type {HTMLInputElement} */ (document.getElementById('character_name_pole'))?.value;
    return name || '';
}

function sections() {
    if (mode === 'group') {
        const editing = visible('rm_group_delete');
        return [
            { heading: currentName() || t('New Server') },
            { label: 'Overview', run: () => scrollTo('') },
            { label: 'Members', run: () => scrollTo('rm_group_members') },
            { label: 'Add Members', run: () => scrollTo('rm_group_add_members') },
            { label: 'Scenario', run: () => press('rm_group_scenario') },
            ...(editing ? ['separator', { label: 'Delete Server', danger: true, run: () => press('rm_group_delete') }] : []),
        ];
    }
    const editing = visible('delete_button');
    return [
        { heading: currentName() || t('New Character') },
        { label: 'Profile', run: () => scrollTo('') },
        { label: 'Definitions', run: () => press('advanced_div') },
        ...(editing ? [
            { label: 'Lorebook', run: () => press('world_button') },
            { label: 'Export', run: () => press('export_button') },
            { label: 'Duplicate', run: () => press('dupe_button') },
            'separator',
            { label: 'Delete Character', danger: true, run: () => press('delete_button') },
        ] : []),
    ];
}

function build() {
    let root = document.getElementById(ID);
    if (root) {
        return root;
    }
    root = document.createElement('div');
    root.id = ID;
    root.setAttribute('role', 'dialog');
    const side = document.createElement('div');
    side.className = 'dsc-set-side';
    const nav = document.createElement('nav');
    nav.className = 'dsc-set-nav';
    side.append(nav);
    const main = document.createElement('div');
    main.className = 'dsc-set-main';
    const title = document.createElement('h2');
    title.className = 'dsc-set-title';
    main.append(title);
    const close = document.createElement('div');
    close.className = 'dsc-set-close';
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.setAttribute('aria-label', t('Close'));
    closeButton.append(icon('close', 18));
    closeButton.addEventListener('click', () => closeDrawers());
    const esc = document.createElement('span');
    esc.textContent = 'ESC';
    esc.setAttribute('aria-hidden', 'true');
    close.append(closeButton, esc);
    root.append(side, main, close);
    document.body.append(root);
    return root;
}

function render() {
    const root = build();
    const nav = root.querySelector('.dsc-set-nav');
    let first = true;
    nav.replaceChildren(...sections().map((section) => {
        if (section === 'separator') {
            const sep = document.createElement('div');
            sep.className = 'dsc-set-sep';
            return sep;
        }
        if (section.heading) {
            const heading = document.createElement('h2');
            heading.className = 'dsc-set-heading';
            heading.textContent = section.heading;
            return heading;
        }
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'dsc-set-item';
        item.classList.toggle('dsc-set-danger', !!section.danger);
        item.classList.toggle('dsc-selected', first);
        first = false;
        item.textContent = t(section.label);
        item.addEventListener('click', () => {
            if (!section.danger && !['Definitions', 'Lorebook', 'Export', 'Duplicate', 'Scenario'].includes(section.label)) {
                nav.querySelectorAll('.dsc-set-item').forEach(x => x.classList.toggle('dsc-selected', x === item));
            }
            section.run();
        });
        return item;
    }));
    root.querySelector('.dsc-set-title').textContent = t(mode === 'group' ? 'Server Overview' : 'Profile');
}

/** Follows the character panel: which block shows, and whether it's open. */
function update() {
    const open = document.body.classList.contains('dsc-chars-open');
    const next = !open ? '' : visible('rm_group_chats_block') ? 'group' : visible('rm_ch_create_block') ? 'char' : '';
    const body = document.body.classList;
    body.toggle('dsc-editor-open', !!next);
    body.toggle('dsc-editor-group', next === 'group');
    if (next && (next !== mode || !document.getElementById(ID))) {
        mode = next;
        render();
    } else if (next) {
        // the name heading follows edits and newly opened characters
        const heading = document.querySelector(`#${ID} .dsc-set-heading`);
        if (heading) {
            heading.textContent = currentName() || t(mode === 'group' ? 'New Server' : 'New Character');
        }
    }
    mode = next;
}

export function initEditor() {
    const observer = new MutationObserver(() => requestAnimationFrame(update));
    for (const id of ['rm_ch_create_block', 'rm_group_chats_block', 'rm_characters_block']) {
        const element = document.getElementById(id);
        if (element) {
            observer.observe(element, { attributes: true, attributeFilter: ['style'] });
        }
    }
    const { eventSource, eventTypes } = SillyTavern.getContext();
    eventSource.on(eventTypes.CHAT_CHANGED, () => requestAnimationFrame(update));
    eventSource.on(eventTypes.CHARACTER_EDITED, () => requestAnimationFrame(update));
    eventSource.on(eventTypes.GROUP_UPDATED, () => requestAnimationFrame(update));
    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape' || !document.body.classList.contains('dsc-editor-open')) {
            return;
        }
        const menu = document.getElementById('dsc-menu');
        if (document.querySelector('dialog.popup[open]') || (menu && !menu.hidden)) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        closeDrawers();
    }, true);
    update();
}

/** Called when the panel opens or closes (index.js tracks the drawers). */
export const refreshEditor = () => update();
