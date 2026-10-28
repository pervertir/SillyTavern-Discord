// Discord's Nitro color themes: a gradient behind the whole app with the surfaces tinted over
// it, each on a light or dark base. Gradient stops come from Discord's own stylesheet
// (--bg-gradient-<theme>-N); angles, stop positions and bases from Discord's theme
// definitions (see docs/discord-ui-notes.md). Dusk's and Easter Egg's angles are estimated.

/** [hue, saturation %, lightness %] → css */
const hsl = ([h, s, l]) => `hsl(${h} ${s}% ${l}%)`;

/**
 * @type {Array<{id: string, name: string, base: 'light'|'dark', angle: number, stops: Array<[number[], number]>, tint: string}>}
 */
export const NITRO_THEMES = [
    { id: 'mint-apple', name: 'Mint Apple', base: 'light', angle: 180, tint: '#56b69f',
        stops: [[[165.6, 39.7, 52.5], 6.15], [[118.7, 40.4, 55.9], 48.7], [[86.7, 48.3, 59.8], 93.07]] },
    { id: 'citrus-sherbert', name: 'Citrus Sherbert', base: 'light', angle: 180, tint: '#f3b336',
        stops: [[[39.7, 88.7, 58.2], 31.1], [[18, 81.5, 63.9], 67.09]] },
    { id: 'retro-raincloud', name: 'Retro Raincloud', base: 'light', angle: 148.71, tint: '#3a7ca1',
        stops: [[[201.6, 47, 42.9], 5.64], [[241, 29.6, 61], 26.38], [[201.6, 47, 42.9], 49.92], [[241, 29.6, 61], 73.12]] },
    { id: 'hanami', name: 'Hanami', base: 'light', angle: 38.08, tint: '#efaab3',
        stops: [[[352.2, 68.3, 80.2], 3.56], [[43.1, 73.6, 76.3], 35.49], [[115.7, 43.1, 74.5], 68.78]] },
    { id: 'sunrise', name: 'Sunrise', base: 'light', angle: 154.19, tint: '#9f4175',
        stops: [[[326.8, 42, 43.9], 8.62], [[27.5, 44.9, 58], 48.07], [[50.3, 46.3, 44.5], 76.04]] },
    { id: 'cotton-candy', name: 'Cotton Candy', base: 'light', angle: 180.14, tint: '#f4abb8',
        stops: [[[349.3, 76.8, 81.4], 8.5], [[226.4, 92.6, 84.1], 94.28]] },
    { id: 'lofi-vibes', name: 'Lofi Vibes', base: 'light', angle: 179.52, tint: '#a4c0f7',
        stops: [[[219.8, 83.8, 80.6], 7.08], [[183.8, 57.8, 78.6], 34.94], [[129.6, 46.3, 78.8], 65.12], [[75.7, 48.8, 75.5], 96.23]] },
    { id: 'desert-khaki', name: 'Desert Khaki', base: 'light', angle: 38.99, tint: '#e7dbd0',
        stops: [[[28.7, 32.4, 86.1], 12.92], [[40, 41.3, 78.6], 32.92], [[50.2, 49.6, 75.9], 52.11]] },
    { id: 'easter-egg', name: 'Easter Egg', base: 'light', angle: 180, tint: '#7d8ce0',
        stops: [[[226.7, 58.4, 65.1], 7], [[227.1, 31, 44.3], 94]] },
    { id: 'sunset', name: 'Sunset', base: 'dark', angle: 141.68, tint: '#48288c',
        stops: [[[259.2, 55.6, 35.3], 27.57], [[21.7, 66.7, 57.6], 71.25]] },
    { id: 'chroma-glow', name: 'Chroma Glow', base: 'dark', angle: 128.92, tint: '#0eb5bf',
        stops: [[[183.4, 86.3, 40.2], 3.94], [[258.1, 89.8, 46.3], 26.1], [[298.5, 90.9, 34.3], 39.82], [[264.8, 100, 66.3], 56.89], [[206.7, 75.5, 50.4], 76.45]] },
    { id: 'forest', name: 'Forest', base: 'dark', angle: 162.27, tint: '#142215',
        stops: [[[124.3, 25.9, 10.6], 11.2], [[142.5, 26.2, 23.9], 29.93], [[76.2, 20.6, 24.7], 48.64], [[116.7, 17, 41.6], 67.85], [[42.8, 38.5, 47.8], 83.54]] },
    { id: 'crimson-moon', name: 'Crimson Moon', base: 'dark', angle: 64.92, tint: '#950909',
        stops: [[[0, 88.6, 31], 16.17], [[0, 0, 0], 72]] },
    { id: 'midnight-blurple', name: 'Midnight Blurple', base: 'dark', angle: 48.17, tint: '#5348ca',
        stops: [[[245.1, 55.1, 53.7], 11.21], [[259, 74.5, 10.8], 61.92]] },
    { id: 'mars', name: 'Mars', base: 'dark', angle: 170.82, tint: '#895240',
        stops: [[[14.8, 36.3, 39.4], 14.61], [[0, 36.2, 41.2], 74.62]] },
    { id: 'dusk', name: 'Dusk', base: 'dark', angle: 180, tint: '#665069',
        stops: [[[292.8, 13.5, 36.3], 12], [[223.1, 41, 69.4], 85]] },
    { id: 'under-the-sea', name: 'Under the Sea', base: 'dark', angle: 179.14, tint: '#647962',
        stops: [[[114.8, 10.5, 42.9], 1.91], [[158.7, 20.4, 43.3], 48.99], [[175.4, 10.9, 46.7], 96.35]] },
    { id: 'retro-storm', name: 'Retro Storm', base: 'dark', angle: 148.71, tint: '#3a7ca1',
        stops: [[[201.6, 47, 42.9], 5.64], [[240.9, 27.8, 47.3], 26.38], [[201.6, 47, 42.9], 49.92], [[240.9, 27.8, 47.3], 73.12]] },
    { id: 'neon-nights', name: 'Neon Nights', base: 'dark', angle: 180, tint: '#01a89e',
        stops: [[[176.4, 98.8, 33.1], 0], [[259.3, 39.5, 55.3], 50], [[313.5, 52.5, 46.3], 100]] },
    { id: 'strawberry-lemonade', name: 'Strawberry Lemonade', base: 'dark', angle: 161.03, tint: '#af1a6c',
        stops: [[[327, 74.1, 39.4], 18.79], [[27.8, 71.7, 44.3], 49.76], [[39.6, 80.2, 52.5], 80.72]] },
    { id: 'aurora', name: 'Aurora', base: 'dark', angle: 239.16, tint: '#062053',
        stops: [[[219.7, 86.5, 17.5], 10.39], [[237.8, 76.4, 41.6], 26.87], [[183.6, 78, 33.9], 48.31], [[169.2, 60.2, 32.5], 64.98], [[229.8, 92.5, 26.3], 92.5]] },
    { id: 'sepia', name: 'Sepia', base: 'dark', angle: 69.98, tint: '#857664',
        stops: [[[32.7, 14.2, 45.7], 14.14], [[36.2, 46.8, 24.3], 60.35]] },
    { id: 'blurple-twilight', name: 'Blurple Twilight', base: 'dark', angle: 47.61, tint: '#2c3fe7',
        stops: [[[233.9, 79.6, 53.9], 11.18], [[245.3, 63.8, 31.4], 64.54]] },
];

export function getNitroTheme(id) {
    return NITRO_THEMES.find(x => x.id === id) ?? null;
}

/** The theme's background as a CSS gradient. */
export function gradientOf(theme) {
    return `linear-gradient(${theme.angle}deg, ${theme.stops.map(([color, at]) => `${hsl(color)} ${at}%`).join(', ')})`;
}

/** Puts a Nitro theme on the page (or takes it off, with null). */
export function applyNitroTheme(theme) {
    const body = document.body;
    body.classList.toggle('dsc-gradient', !!theme);
    if (!theme) {
        body.style.removeProperty('--dsc-gradient');
        body.style.removeProperty('--dsc-tint');
        delete body.dataset.dscNitro;
        return;
    }
    body.style.setProperty('--dsc-gradient', gradientOf(theme));
    body.style.setProperty('--dsc-tint', theme.tint);
    body.dataset.dscNitro = theme.id;
}
