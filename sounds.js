// Discord-like sounds, made here with the Web Audio API rather than copied from Discord: the
// soft two-tone message ping, a rising chime when someone comes online, and the mute,
// unmute, deafen and undeafen tones of the user panel. Like Discord, a reply in the chat
// you're looking at stays quiet; the ping plays when the window isn't in front. Deafen
// silences every sound. Nothing plays until the page has had a click or key press
// (browsers' autoplay rule).

let audio = null;
let unlocked = false;
let getSettings = () => ({});

/** Each sound: notes as [frequency Hz, start s, length s, peak gain] */
const SOUNDS = {
    message: [[1318.5, 0, 0.09, 0.22], [1760, 0.075, 0.16, 0.2]],
    online: [[880, 0, 0.1, 0.14], [1174.7, 0.08, 0.12, 0.14], [1568, 0.16, 0.2, 0.12]],
    mute: [[784, 0, 0.07, 0.18], [523.3, 0.06, 0.12, 0.16]],
    unmute: [[523.3, 0, 0.07, 0.16], [784, 0.06, 0.12, 0.18]],
    deafen: [[659.3, 0, 0.08, 0.18], [440, 0.07, 0.1, 0.16], [329.6, 0.14, 0.14, 0.14]],
    undeafen: [[329.6, 0, 0.08, 0.14], [440, 0.07, 0.1, 0.16], [659.3, 0.14, 0.14, 0.18]],
};

/** Which setting turns each sound on or off */
const TOGGLES = {
    message: 'soundMessage',
    online: 'soundOnline',
    mute: 'soundVoice',
    unmute: 'soundVoice',
    deafen: 'soundVoice',
    undeafen: 'soundVoice',
};

function context() {
    if (!audio) {
        const Context = window.AudioContext || window.webkitAudioContext;
        if (!Context) {
            return null;
        }
        audio = new Context();
    }
    return audio;
}

function unlock() {
    if (unlocked) {
        return;
    }
    unlocked = true;
    context()?.resume?.();
}

/** Plays one of the sounds, if sounds are on, it's enabled, and you're not deafened. */
export function play(name, { force = false } = {}) {
    const settings = getSettings();
    const notes = SOUNDS[name];
    if (!notes || !settings.enabled || !settings.sounds || !settings[TOGGLES[name]]) {
        return false;
    }
    // deafened: nothing at all, except the undeafen tone itself; Do Not Disturb: no pings
    if ((settings.deafened && !force) || (settings.myStatus === 'dnd' && (name === 'message' || name === 'online'))) {
        return false;
    }
    const ctx = context();
    if (!ctx || !unlocked) {
        return false;
    }
    const volume = Math.max(0, Math.min(100, Number(settings.soundVolume) || 0)) / 100;
    const now = ctx.currentTime + 0.01;
    const master = ctx.createGain();
    master.gain.value = volume;
    master.connect(ctx.destination);
    for (const [frequency, start, length, peak] of notes) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(frequency, now + start);
        gain.gain.setValueAtTime(0.0001, now + start);
        gain.gain.exponentialRampToValueAtTime(peak, now + start + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + start + length);
        osc.connect(gain).connect(master);
        osc.start(now + start);
        osc.stop(now + start + length + 0.02);
    }
    window.dispatchEvent(new CustomEvent('dsc-sound', { detail: name }));
    return true;
}

/** Whether you'd see a new message without being told: the window is in front. */
function watching() {
    return document.visibilityState === 'visible' && document.hasFocus();
}

/**
 * @param {object} options
 * @param {() => object} options.settings The theme settings (sounds, soundVolume, sound*, muted, deafened)
 * @param {() => void} options.save Saves the settings
 */
export function initSounds({ settings, save }) {
    getSettings = settings;
    for (const type of ['pointerdown', 'keydown']) {
        document.addEventListener(type, unlock, { capture: true, once: true });
    }

    const { eventSource, eventTypes } = SillyTavern.getContext();
    eventSource.on(eventTypes.CHARACTER_MESSAGE_RENDERED, (mesId, type) => {
        // a reply arriving while you're elsewhere pings, as a Discord message does
        if (type === 'first_message' || watching()) {
            return;
        }
        play('message');
    });

    // the user panel's mute and deafen keep their state and make their sounds
    const panel = document.getElementById('dsc-user');
    const mute = panel?.querySelector('.dsc-mute');
    const deafen = panel?.querySelector('.dsc-deafen');
    const state = getSettings();
    mute?.classList.toggle('dsc-off', !!state.muted || !!state.deafened);
    deafen?.classList.toggle('dsc-off', !!state.deafened);
    mute?.addEventListener('click', () => {
        const s = getSettings();
        s.muted = mute.classList.contains('dsc-off');
        save();
        play(s.muted ? 'mute' : 'unmute');
    });
    deafen?.addEventListener('click', () => {
        const s = getSettings();
        s.deafened = deafen.classList.contains('dsc-off');
        s.muted = !!mute?.classList.contains('dsc-off');
        save();
        play(s.deafened ? 'deafen' : 'undeafen', { force: true });
    });
}
