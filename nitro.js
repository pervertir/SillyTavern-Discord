// Discord's Nitro color themes, built the way Discord builds them (docs/discord-reference.md,
// section 2): a gradient fixed to the window, each surface a translucent veil over it, and the
// solid colours and text tinted towards the theme's own hues. Dark themes ride on Ash, light
// ones on Light.

/**
 * @typedef {object} NitroTheme
 * @property {string} id
 * @property {string} name
 * @property {'light'|'dark'} base
 * @property {number} angle
 * @property {Array<[string, number]>} stops colour and position in %
 * @property {string} baseTint surfaces are mixed towards this
 * @property {string} textTint text and icons are mixed towards this
 * @property {number} [veil] scales how far the veils move from their base strength (1 if unset)
 */

/** @type {NitroTheme[]} */
export const NITRO_THEMES = [
    { id: 'mint-apple', name: 'Mint Apple', base: 'light', angle: 180, baseTint: '#e8ffcc', textTint: '#004d3a',
        stops: [['#56b69f', 6.15], ['#63bc61', 48.7], ['#9eca67', 93.07]] },
    { id: 'citrus-sherbert', name: 'Citrus Sherbert', base: 'light', angle: 180, baseTint: '#ffeecc', textTint: '#4d1700',
        stops: [['#f3b336', 31.1], ['#ee8558', 67.09]] },
    { id: 'retro-raincloud', name: 'Retro Raincloud', base: 'light', angle: 148.71, baseTint: '#ccedff', textTint: '#005280',
        stops: [['#3a7ca1', 5.64], ['#7f7eb9', 26.38], ['#7f7eb9', 49.92], ['#3a7ca1', 73.12]] },
    { id: 'hanami', name: 'Hanami', base: 'light', angle: 38.08, baseTint: '#d0ffcc', textTint: '#4d000a',
        stops: [['#efaab3', 3.56], ['#efd696', 35.49], ['#a6daa2', 68.78]] },
    { id: 'sunrise', name: 'Sunrise', base: 'light', angle: 154.19, baseTint: '#fff7cc', textTint: '#4d002a',
        stops: [['#9f4175', 8.62], ['#c49064', 48.07], ['#a6953d', 76.04]] },
    { id: 'cotton-candy', name: 'Cotton Candy', base: 'light', angle: 180.14, baseTint: '#ccd8ff', textTint: '#4d000e',
        stops: [['#f4abb8', 8.5], ['#b1c2fc', 94.28]] },
    { id: 'lofi-vibes', name: 'Lofi Vibes', base: 'light', angle: 179.52, baseTint: '#f2ffcc', textTint: '#002b80',
        stops: [['#a4c0f7', 7.08], ['#a9e4e8', 34.94], ['#b0e2b8', 65.12], ['#cfdfa2', 96.23]] },
    { id: 'desert-khaki', name: 'Desert Khaki', base: 'light', angle: 38.99, baseTint: '#ffe4cc', textTint: '#4d4000',
        stops: [['#e7dbd0', 12.92], ['#dfd0b2', 32.92], ['#e0d6a3', 52.11]] },
    { id: 'easter-egg', name: 'Easter Egg', base: 'light', angle: 180, baseTint: '#ccd7ff', textTint: '#001b80',
        stops: [['#7289da', 4], ['#4e5d94', 96]] },
    { id: 'sunset', name: 'Sunset', base: 'dark', angle: 141.68, baseTint: '#08001a', textTint: '#ffefe5',
        stops: [['#48288c', 27.57], ['#db7f4b', 71.25]] },
    { id: 'chroma-glow', name: 'Chroma Glow', base: 'dark', angle: 128.92, baseTint: '#000e1a', textTint: '#e5feff',
        stops: [['#0eb5bf', 3.94], ['#4c0ce0', 26.1], ['#a308a7', 39.82], ['#9a53ff', 56.89], ['#218be0', 76.45]] },
    { id: 'forest', name: 'Forest', base: 'dark', angle: 162.27, baseTint: '#001a02', textTint: '#fff8e5',
        stops: [['#142215', 11.2], ['#2d4d39', 29.93], ['#454c32', 48.64], ['#5a7c58', 67.85], ['#a98e4b', 83.54]] },
    { id: 'crimson-moon', name: 'Crimson Moon', base: 'dark', angle: 64.92, baseTint: '#1a0000', textTint: '#ffe5e5',
        stops: [['#950909', 16.17], ['#000000', 72]] },
    { id: 'midnight-blurple', name: 'Midnight Blurple', base: 'dark', angle: 48.17, baseTint: '#08001a', textTint: '#a299ff',
        stops: [['#5348ca', 11.21], ['#140730', 61.92]] },
    { id: 'mars', name: 'Mars', base: 'dark', angle: 170.82, baseTint: '#1a0600', textTint: '#ffece5',
        stops: [['#895240', 14.61], ['#8f4343', 74.62]] },
    { id: 'dusk', name: 'Dusk', base: 'dark', angle: 180, baseTint: '#16001a', textTint: '#99b6ff',
        stops: [['#665069', 12.84], ['#91a3d1', 85.99]] },
    { id: 'under-the-sea', name: 'Under the Sea', base: 'dark', angle: 179.14, baseTint: '#021a00', textTint: '#e5fffd',
        stops: [['#647962', 1.91], ['#588575', 48.99], ['#6a8482', 96.35]] },
    { id: 'retro-storm', name: 'Retro Storm', base: 'dark', angle: 148.71, baseTint: '#00101a', textTint: '#99daff',
        stops: [['#3a7ca1', 5.64], ['#58579a', 26.38], ['#58579a', 49.92], ['#3a7ca1', 73.12]] },
    { id: 'neon-nights', name: 'Neon Nights', base: 'dark', angle: 180, baseTint: '#1a0014', textTint: '#e5fffd',
        stops: [['#01a89e', 0], ['#7d60ba', 50], ['#b43898', 100]] },
    { id: 'strawberry-lemonade', name: 'Strawberry Lemonade', base: 'dark', angle: 161.03, baseTint: '#1a000e', textTint: '#fff6e5',
        stops: [['#af1a6c', 18.79], ['#c26b20', 49.76], ['#e7a525', 80.72]] },
    { id: 'aurora', name: 'Aurora', base: 'dark', angle: 239.16, baseTint: '#00091a', textTint: '#99aaff',
        stops: [['#062053', 10.39], ['#191fbb', 26.87], ['#13929a', 48.31], ['#218573', 64.98], ['#051a81', 92.5]] },
    { id: 'sepia', name: 'Sepia', base: 'dark', angle: 69.98, baseTint: '#1a0f00', textTint: '#fff3e5',
        stops: [['#857664', 14.14], ['#5b4421', 60.35]] },
    { id: 'blurple-twilight', name: 'Blurple Twilight', base: 'dark', angle: 47.61, baseTint: '#02001a', textTint: '#99a3ff',
        stops: [['#2c3fe7', 11.18], ['#261d83', 64.54]] },
    { id: 'hexagon', name: 'Hexagon', base: 'dark', angle: 135, baseTint: '#00001a', textTint: '#fff5e5', veil: 0.8,
        stops: [['#4645ff', 0], ['#af01f3', 33.33], ['#ff6698', 66.67], ['#f89a03', 100]] },
];

/** The base palette each surface and text colour starts from: Ash for dark themes, Light for light. */
const PALETTES = {
    dark: {
        surfaces: { rail: '#2c2d32', side: '#323339', chat: '#323339', panel: '#36373e', surface: '#393a41', floating: '#3c3d45', 'surface-top': '#3f4048', input: '#393a41' },
        text: { header: '#ffffff', text: '#f3f3f4', 'header-2': '#c5c6ca', muted: '#abacb2', channel: '#999aa1', link: '#76aff6', 'critical-text': '#ffa09b' },
        veil: '0 0 0',
    },
    light: {
        surfaces: { rail: '#f3f3f4', side: '#fbfbfb', chat: '#fbfbfb', panel: '#fbfbfb', surface: '#ffffff', floating: '#ffffff', 'surface-top': '#ffffff', input: '#ffffff' },
        text: { header: '#28282d', text: '#2e2e34', 'header-2': '#595a63', muted: '#6c6d76', channel: '#666770', link: '#006dd4', 'critical-text': '#b92733' },
        veil: '255 255 255',
    },
};

/** Discord's mix amounts for a preset: surfaces 50%, text 38% (each mixed as value 100% + tint n%). */
const BASE_AMOUNT = 50;
const TEXT_AMOUNT = 38;
/** The grey every hover, selection and border is made of */
const MOD_GREY = '#97979f';

/**
 * Veil strength per surface tier at full mix (m = 1) as [base, per-unit of m]: the veil is
 * base + m × slope. Our surfaces map onto Discord's tiers: the frame (title bar, rail) is
 * app-frame, the lists are high, the chat and member list are chat, the composer and user
 * panel are highest.
 */
const VEILS = {
    dark: { rail: [0.42, 0.28], side: [0.45, 0.30], chat: [0.48, 0.32], panel: [0.39, 0.26], input: [0.39, 0.26] },
    light: { rail: [0.325, 0.325], side: [0.42, 0.28], chat: [0.51, 0.34], panel: [0.76, 0.19], input: [0.76, 0.19] },
};

export function getNitroTheme(id) {
    return NITRO_THEMES.find(x => x.id === id) ?? null;
}

/** The theme's background as a CSS gradient. */
export function gradientOf(theme) {
    return `linear-gradient(${theme.angle}deg, ${theme.stops.map(([color, at]) => `${color} ${at}%`).join(', ')})`;
}

/* Oklab mixing, as CSS color-mix(in oklab, …) does it */

function hexToRgb(hex) {
    const n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const toLinear = c => (c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
const toSrgb = c => Math.round(255 * Math.min(1, Math.max(0, c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055)));

function toOklab([r, g, b]) {
    [r, g, b] = [r, g, b].map(toLinear);
    const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
    const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
    const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    return [
        0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
        1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
        0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s,
    ];
}

function fromOklab([L, a, b]) {
    const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
    const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
    const s = (L - 0.0894841775 * a - 1.2914855480 * b) ** 3;
    return [
        4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
        -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
        -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
    ].map(toSrgb);
}

/** color-mix(in oklab, color 100%, tint amount%), as rgb channels */
function mix(color, tint, amount) {
    const weight = amount / (100 + amount);
    const a = toOklab(hexToRgb(color));
    const b = toOklab(hexToRgb(tint));
    return fromOklab(a.map((value, i) => value + (b[i] - value) * weight));
}

const rgb = channels => `rgb(${channels.join(' ')})`;

/** Every custom property a theme sets on the body: name → value. */
function propertiesOf(theme) {
    const palette = PALETTES[theme.base];
    const m = theme.veil ?? 1;
    const gradient = gradientOf(theme);
    /** @type {Record<string, string>} */
    const properties = { '--dsc-gradient': gradient, '--dsc-mod': mix(MOD_GREY, theme.baseTint, BASE_AMOUNT).join(', ') };
    for (const [name, color] of Object.entries(palette.surfaces)) {
        properties[`--dsc-${name}`] = rgb(mix(color, theme.baseTint, BASE_AMOUNT));
    }
    for (const [name, color] of Object.entries(palette.text)) {
        properties[`--dsc-${name}`] = rgb(mix(color, theme.textTint, TEXT_AMOUNT));
    }
    for (const [tier, [base, slope]] of Object.entries(VEILS[theme.base])) {
        const veil = `rgb(${palette.veil} / ${(base + m * slope).toFixed(3)})`;
        properties[`--dsc-paint-${tier}`] = `linear-gradient(${veil}, ${veil}) fixed, ${gradient} fixed`;
    }
    return properties;
}

/** Names of the properties applyNitroTheme last set, to take off again */
let applied = [];

/** Puts a Nitro theme on the page (or takes it off, with null). */
export function applyNitroTheme(theme) {
    const style = document.body.style;
    for (const name of applied) {
        style.removeProperty(name);
    }
    applied = [];
    document.body.classList.toggle('dsc-gradient', !!theme);
    if (!theme) {
        delete document.body.dataset.dscNitro;
        return;
    }
    for (const [name, value] of Object.entries(propertiesOf(theme))) {
        style.setProperty(name, value);
        applied.push(name);
    }
    document.body.dataset.dscNitro = theme.id;
}
