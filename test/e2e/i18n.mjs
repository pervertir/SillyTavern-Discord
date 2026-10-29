// With SillyTavern set to German, none of the theme's own words may still show in English:
// any visible text in the theme's UI that is an English string from locales/en.json whose
// German translation is different counts as untranslated.
import fs from 'node:fs';
import { chromium, BROWSER, URL } from './env.mjs';

const english = JSON.parse(fs.readFileSync(new globalThis.URL('../../locales/en.json', import.meta.url), 'utf8'));
const german = JSON.parse(fs.readFileSync(new globalThis.URL('../../locales/de-de.json', import.meta.url), 'utf8'));
const watch = Object.keys(english).filter(k => german[k] && german[k] !== k && k.length > 2);

const browser = await chromium.launch({ executablePath: BROWSER, headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = []; page.on('pageerror', e => errors.push(e.message));
await page.addInitScript(() => localStorage.setItem('language', 'de-de'));
await page.goto(URL, { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => document.querySelector('#dsc-side .dsc-dm') && !document.body.classList.contains('dsc-booting'), null, { timeout: 60000 });
await page.waitForTimeout(1200);
const scan = (label) => page.evaluate(([label, watch]) => {
    const set = new Set(watch);
    const found = new Set();
    for (const e of document.querySelectorAll('[id^="dsc-"], [id^="dsc-"] *, .dsc-settings-panel *')) {
        if (e.closest('#chat .mes_text, .dsc-dm .dsc-row-name, .dsc-member .dsc-row-name, .dsc-prof-name')) continue;
        const r = e.getBoundingClientRect(); if (!r.width || !r.height) continue;
        for (const n of e.childNodes) if (n.nodeType === 3) { const t = n.nodeValue.trim(); if (set.has(t)) found.add(t); }
        for (const a of ['aria-label', 'placeholder', 'title', 'data-dsc-tip']) { const v = e.getAttribute(a); if (v && set.has(v.trim())) found.add(`${a}: ${v.trim()}`); }
    }
    return [label, [...found]];
}, [label, watch]);
const show = ([label, items]) => { console.log(`== ${label}: ${items.length} untranslated`); items.slice(0, 20).forEach(x => console.log('   ' + x)); };
show(await scan('home'));
await page.evaluate(() => document.querySelector('#dsc-user .dsc-user-tool:last-child').click()); await page.waitForTimeout(700);
show(await scan('settings'));
for (const sel of ['[data-page="customize"]', '[data-page="notifications"]', '[data-page="keybinds"]']) {
    await page.click(`.dsc-set-item${sel}`); await page.waitForTimeout(600);
    show(await scan(sel));
}
await page.keyboard.press('Escape'); await page.waitForTimeout(400);
await page.locator('#dsc-side .dsc-dm').first().click(); await page.waitForTimeout(1500);
show(await scan('chat'));
await page.evaluate(() => localStorage.removeItem('language'));
console.log('errors', errors);
await browser.close();
