// AI settings as Discord forms (with css/forms.css):
// - AI Config shows the everyday samplers; the rest fold behind "Show all samplers", one
//   switch for every API's panel, remembered on this device.
// - The Instruct Template page starts with a plain "Instruct Mode" switch row, tied to
//   SillyTavern's own power button, so it's clear why the page is greyed out when it's off.

import { t } from './ui.js';
import { listen, onEvent } from './life.js';

const ALL_KEY = 'dsc-all-samplers';

/** Sliders everyone uses, by the end of their ids (the API suffix doesn't matter). */
const EVERYDAY = /^(amount_gen|max_context|openai_max_context|temp|top_p|top_k|min_p|rep_pen|repetition_penalty|freq_pen|pres_pen|presence_pen)(_openai|_textgenerationwebui|_novel|_kobold)?$/;

/** The row a slider sits in: Kobold/Text Completion column, or Chat Completion .range-block. */
function rowOf(range) {
    return range.closest('.range-block, .flex-container.flexFlowColumn, .range-block-range-and-counter');
}

function showAll(on) {
    document.body.classList.toggle('dsc-all-samplers', on);
    try {
        localStorage.setItem(ALL_KEY, on ? '1' : '');
    } catch {
        // storage can be refused
    }
    for (const button of document.querySelectorAll('.dsc-samplers-toggle')) {
        button.textContent = t(on ? 'Show fewer samplers' : 'Show all samplers');
        button.setAttribute('aria-expanded', String(on));
    }
}

function foldSamplers() {
    const panel = document.getElementById('left-nav-panel');
    if (!panel || panel.dataset.dscFolded) {
        return;
    }
    panel.dataset.dscFolded = '1';
    /** the last everyday row of each API's settings block, to put the button after */
    const lastEveryday = new Map();
    for (const range of panel.querySelectorAll('input[type="range"][id]')) {
        const row = rowOf(range);
        const block = range.closest('[id$="api-settings"], [id$="_settings"], #openai_settings, #textgenerationwebui_api-settings, #kobold_api-settings, #novel_api-settings');
        if (!row || !block) {
            continue;
        }
        if (EVERYDAY.test(range.id)) {
            lastEveryday.set(block, row);
        } else {
            row.classList.add('dsc-more-sampler');
        }
    }
    // a group whose sliders are all folded (Mirostat, DRY, …) folds with its heading
    for (const group of panel.querySelectorAll('.flex-container, .range-block-range-and-counter')) {
        const children = [...group.children];
        if (children.length && children.every(child => child.classList.contains('dsc-more-sampler'))) {
            group.classList.add('dsc-more-sampler');
            const heading = group.previousElementSibling;
            if (heading?.matches('h4, h5, .range-block-title, small, b, label') && heading.textContent.trim().length < 40) {
                heading.classList.add('dsc-more-sampler');
            }
        }
    }
    for (const [block, row] of lastEveryday) {
        if (!block.querySelector('.dsc-more-sampler')) {
            continue;
        }
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'dsc-samplers-toggle';
        button.addEventListener('click', () => showAll(!document.body.classList.contains('dsc-all-samplers')));
        // right under the last everyday slider (the slider containers are columns here)
        row.after(button);
    }
    let on = false;
    try {
        on = localStorage.getItem(ALL_KEY) === '1';
    } catch {
        on = false;
    }
    showAll(on);
}

function instructRow() {
    const column = document.getElementById('InstructSettingsColumn');
    const power = /** @type {HTMLInputElement} */ (document.getElementById('instruct_enabled'));
    if (!column || !power || column.querySelector('.dsc-instruct-switch')) {
        return;
    }
    const row = document.createElement('label');
    row.className = 'dsc-instruct-switch';
    const text = document.createElement('span');
    const name = document.createElement('b');
    name.textContent = t('Instruct Mode');
    const note = document.createElement('small');
    note.textContent = t('Formats prompts with this template\'s sequences. Most local models need it on; Chat Completion APIs ignore it.');
    text.append(name, note);
    const box = document.createElement('input');
    box.type = 'checkbox';
    const sync = () => {
        box.checked = !!SillyTavern.getContext().powerUserSettings?.instruct?.enabled;
    };
    box.addEventListener('change', () => {
        if (box.checked !== !!SillyTavern.getContext().powerUserSettings?.instruct?.enabled) {
            // SillyTavern's own switch, so its own handlers run
            power.click();
        }
        setTimeout(sync, 0);
    });
    listen(power, 'change', () => setTimeout(sync, 0));
    row.append(text, box);
    const header = column.querySelector(':scope > .flex-container, :scope > h4, :scope > div');
    (header ?? column.firstElementChild)?.after(row);
    sync();
}

/** Discord's slider fill: blurple up to the thumb (css/polish.css reads --dsc-fill). */
function fill(range) {
    const min = Number(range.min) || 0;
    const max = Number(range.max) || 100;
    const share = max > min ? (Number(range.value) - min) / (max - min) : 0;
    range.style.setProperty('--dsc-fill', `${Math.max(0, Math.min(100, share * 100))}%`);
}

/** Fills every slider in a part of the page (SillyTavern also moves them from its code). */
export function fillSliders(root = document) {
    root.querySelectorAll('input[type="range"]').forEach(fill);
}

export function initForms() {
    for (const type of ['input', 'change']) {
        listen(document, type, (event) => {
            const target = /** @type {HTMLElement} */ (event.target);
            if (target instanceof HTMLInputElement && target.type === 'range') {
                fill(target);
            }
        }, true);
    }
    fillSliders();
    foldSamplers();
    instructRow();
    const { eventTypes } = SillyTavern.getContext();
    onEvent(eventTypes.SETTINGS_LOADED_AFTER ?? eventTypes.SETTINGS_UPDATED, () => setTimeout(instructRow, 0));
}
