// Discord exists in SillyTavern's page only while it's on.
// - Off at load: nothing is built (only its own settings panel in the Extensions list).
// - Built: every handler the theme's modules register while being built (SillyTavern events,
//   DOM listeners, MutationObservers) is gated, so it does nothing while the theme is off.
//   The modules register them synchronously, so wrapping the registration functions for that
//   moment can't touch any other extension.
// - Turned off live: teardown() removes everything the theme added to SillyTavern's page
//   (its elements, classes, attributes, styles) and redraws the open chat with SillyTavern's
//   own formatting.

/**
 * Builds the theme with every handler registered meanwhile gated by isOn().
 * @param {() => boolean} isOn
 * @param {() => void} build Synchronous
 */
export function buildGated(isOn, build) {
    const { eventSource } = SillyTavern.getContext();
    const wrap = fn => (typeof fn === 'function'
        ? function gated(...args) {
            return isOn() ? fn.apply(this, args) : undefined;
        }
        : fn);
    const originalOn = eventSource.on;
    const originalAdd = EventTarget.prototype.addEventListener;
    const OriginalObserver = window.MutationObserver;
    eventSource.on = function (type, listener) {
        return originalOn.call(this, type, wrap(listener));
    };
    EventTarget.prototype.addEventListener = function (type, listener, options) {
        return originalAdd.call(this, type, wrap(listener), options);
    };
    window.MutationObserver = class extends OriginalObserver {
        constructor(callback) {
            super(wrap(callback));
        }
    };
    try {
        build();
    } finally {
        eventSource.on = originalOn;
        EventTarget.prototype.addEventListener = originalAdd;
        window.MutationObserver = OriginalObserver;
    }
}

/** Elements the theme makes inside SillyTavern's own blocks, which carry only a class. */
const MADE = '.dsc-samplers-toggle, .dsc-instruct-switch, .dsc-react-button, .dsc-file-download, .dsc-tool-search-phone, .dsc-edited, .dsc-embeds, .dsc-reactions';

/** Whether an element belongs to the theme's own settings panel (in the Extensions list). */
function inPanel(element) {
    return !!element.closest('.dsc-settings-panel');
}

/** Removes everything the theme added to SillyTavern's page. */
export function teardown() {
    // the theme's own elements: by id, and the class-only ones it puts in SillyTavern's blocks
    for (const element of [...document.querySelectorAll('[id^="dsc-"], [id^="dsc_"]'), ...document.querySelectorAll(MADE)]) {
        if (element.isConnected && !inPanel(element)) {
            element.remove();
        }
    }
    // its classes, attributes and variables on SillyTavern's own elements
    for (const element of document.querySelectorAll('[class*="dsc-"], [style*="--dsc-"]')) {
        if (inPanel(element)) {
            continue;
        }
        const ours = [...element.classList].filter(name => name.startsWith('dsc-'));
        if (ours.length) {
            element.classList.remove(...ours);
        }
        for (const property of [...element.style].filter(name => name.startsWith('--dsc-'))) {
            element.style.removeProperty(property);
        }
    }
    for (const element of document.querySelectorAll('*')) {
        if (inPanel(element)) {
            continue;
        }
        for (const attribute of [...element.attributes].filter(a => a.name.startsWith('data-dsc'))) {
            element.removeAttribute(attribute.name);
        }
    }
    for (const html of [document.documentElement, document.body]) {
        html.classList.remove(...[...html.classList].filter(name => name.startsWith('dsc-')));
    }
    // messages: SillyTavern draws the open chat again with its own formatting
    const context = SillyTavern.getContext();
    if (context.getCurrentChatId?.()) {
        context.reloadCurrentChat?.();
    }
}
