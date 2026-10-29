// Discord's emoji picker on the message box's emoji button (and Ctrl/⌘+E): a search box,
// category buttons down the side, a grid with Frequently Used first, and the hovered emoji's
// name along the bottom. A pick goes into the message box at the cursor; Shift+click keeps
// the picker open to add several.

import { EMOJI_CATEGORIES, searchEmoji } from './lib/emoji-data.js';
import { shieldFromOutsideClose, t } from './ui.js';

const PICKER_ID = 'dsc-emoji-picker';
const RECENT_KEY = 'dsc-recent-emoji';

function recent() {
    try {
        return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]').slice(0, 18);
    } catch {
        return [];
    }
}

function remember(char) {
    try {
        localStorage.setItem(RECENT_KEY, JSON.stringify([char, ...recent().filter(x => x !== char)].slice(0, 18)));
    } catch {
        // storage can be refused
    }
}

const WORDS = new Map(EMOJI_CATEGORIES.flatMap(category => category.emoji.map(item => [item.char, item.words])));

/** Puts text into the message box at the cursor. */
function insert(char) {
    const box = /** @type {HTMLTextAreaElement} */ (document.getElementById('send_textarea'));
    if (!box) {
        return;
    }
    const start = box.selectionStart ?? box.value.length;
    const end = box.selectionEnd ?? start;
    box.value = box.value.slice(0, start) + char + box.value.slice(end);
    const caret = start + char.length;
    box.dispatchEvent(new Event('input', { bubbles: true }));
    // focus moves after the key or click that picked it has finished: SillyTavern sends on an
    // Enter that reaches the page while the message box has focus
    setTimeout(() => {
        box.focus();
        box.setSelectionRange(caret, caret);
    }, 0);
}

export function closeEmojiPicker() {
    document.getElementById(PICKER_ID)?.remove();
    document.querySelector('.dsc-compose-tool.dsc-open')?.classList.remove('dsc-open');
}

/** Opens or closes the picker above a button. */
export function toggleEmojiPicker(anchor) {
    if (document.getElementById(PICKER_ID)) {
        closeEmojiPicker();
        return;
    }
    const picker = document.createElement('div');
    picker.id = PICKER_ID;
    picker.setAttribute('role', 'dialog');
    picker.setAttribute('aria-label', t('Emoji'));

    const search = document.createElement('input');
    search.type = 'search';
    search.className = 'dsc-ep-search';
    search.placeholder = t('Find the perfect emoji');
    search.setAttribute('aria-label', search.placeholder);

    const side = document.createElement('nav');
    side.className = 'dsc-ep-side';
    const grid = document.createElement('div');
    grid.className = 'dsc-ep-grid';
    const footer = document.createElement('div');
    footer.className = 'dsc-ep-foot';
    const footChar = document.createElement('span');
    footChar.className = 'dsc-ep-foot-char';
    const footName = document.createElement('span');
    footName.className = 'dsc-ep-foot-name';
    footer.append(footChar, footName);

    const cell = (char) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'dsc-ep-cell';
        button.textContent = char;
        const words = WORDS.get(char) ?? '';
        button.setAttribute('aria-label', words.split(' ')[0] || char);
        button.addEventListener('mouseenter', () => {
            footChar.textContent = char;
            footName.textContent = `:${(words.split(' ')[0] || '').replace(/\s+/g, '_')}:`;
        });
        button.addEventListener('click', (event) => {
            remember(char);
            insert(char);
            if (!event.shiftKey) {
                closeEmojiPicker();
            }
        });
        return button;
    };

    const section = (id, title, chars) => {
        const block = document.createElement('section');
        block.className = 'dsc-ep-section';
        block.dataset.category = id;
        const heading = document.createElement('h3');
        heading.textContent = t(title);
        const cells = document.createElement('div');
        cells.className = 'dsc-ep-cells';
        cells.append(...chars.map(cell));
        block.append(heading, cells);
        return block;
    };

    const fill = () => {
        const query = search.value.trim();
        if (query) {
            const found = searchEmoji(query);
            grid.replaceChildren(found.length
                ? section('search', 'Search Results', found.map(x => x.char))
                : Object.assign(document.createElement('div'), { className: 'dsc-ep-empty', textContent: t('No emoji match that search.') }));
            return;
        }
        const recents = recent();
        grid.replaceChildren(
            ...(recents.length ? [section('recent', 'Frequently Used', recents)] : []),
            ...EMOJI_CATEGORIES.map(category => section(category.name, category.name, category.emoji.map(x => x.char))),
        );
    };

    // category buttons: an emoji standing for each, as Discord's side rail
    const ICONS = { recent: '🕘', People: '😀', Nature: '🌿', Food: '🍕', Activities: '⚽', Travel: '✈️', Objects: '💡', Symbols: '❤️' };
    for (const [id, glyph] of Object.entries(ICONS)) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'dsc-ep-cat';
        button.textContent = glyph;
        button.dataset.dscTip = t(id === 'recent' ? 'Frequently Used' : id);
        button.setAttribute('aria-label', button.dataset.dscTip);
        button.addEventListener('click', () => {
            if (search.value) {
                search.value = '';
                fill();
            }
            grid.querySelector(`.dsc-ep-section[data-category="${id}"]`)?.scrollIntoView({ block: 'start' });
        });
        side.append(button);
    }

    search.addEventListener('input', fill);
    search.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();
            /** @type {HTMLElement} */ (grid.querySelector('.dsc-ep-cell'))?.click();
        }
    });

    const body = document.createElement('div');
    body.className = 'dsc-ep-body';
    body.append(side, grid);
    picker.append(search, body, footer);
    fill();
    shieldFromOutsideClose(picker);
    document.body.append(picker);
    anchor?.classList.add('dsc-open');

    const box = anchor?.getBoundingClientRect();
    const own = picker.getBoundingClientRect();
    if (box) {
        picker.style.left = `${Math.round(Math.max(8, Math.min(box.right - own.width, window.innerWidth - own.width - 8)))}px`;
        picker.style.top = `${Math.round(Math.max(8, box.top - own.height - 8))}px`;
    }
    search.focus();
}

export function initEmojiPicker() {
    document.addEventListener('pointerdown', (event) => {
        const picker = document.getElementById(PICKER_ID);
        const target = /** @type {HTMLElement} */ (event.target);
        if (picker && !picker.contains(target) && !target.closest('.dsc-compose-tool.dsc-open')) {
            closeEmojiPicker();
        }
    }, true);
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && document.getElementById(PICKER_ID)) {
            event.preventDefault();
            event.stopPropagation();
            closeEmojiPicker();
            document.getElementById('send_textarea')?.focus();
        }
    }, true);
    SillyTavern.getContext().eventSource.on(SillyTavern.getContext().eventTypes.CHAT_CHANGED, closeEmojiPicker);
}
