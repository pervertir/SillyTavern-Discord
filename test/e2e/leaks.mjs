// Discord installed but off: nothing of Discord's may be in SillyTavern's page (its own settings
// panel in the Extensions list aside). Then on, off, on again, off again.
import { chromium, BROWSER, URL } from './env.mjs';
const browser = await chromium.launch({ executablePath: BROWSER, headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = []; page.on('pageerror', e => errors.push(e.message));
const load = async () => {
  await page.waitForFunction(() => window.SillyTavern && document.querySelector('#send_textarea') && document.getElementById('dsc_enabled'), null, { timeout: 40000 });
  await page.waitForTimeout(2500);
};
const leaks = () => page.evaluate(() => {
  const inPanel = e => !!e.closest('.dsc-settings-panel');
  const out = [];
  for (const e of document.querySelectorAll('*')) {
    if (inPanel(e)) continue;
    const id = e.id && /^dsc[-_]/.test(e.id) ? '#' + e.id : '';
    const cls = [...e.classList].filter(c => /^dsc-/.test(c));
    const data = [...e.attributes].filter(a => /^data-dsc/.test(a.name)).map(a => a.name);
    const style = (e.getAttribute('style') || '').match(/--dsc-[a-z-]+/g) || [];
    if (id || cls.length || data.length || style.length) out.push(`${e.tagName.toLowerCase()}${id}${cls.length ? '.' + cls.join('.') : ''}${data.length ? '[' + data.join(',') + ']' : ''}${style.length ? '{' + style.join(',') + '}' : ''} in ${e.parentElement?.id || e.parentElement?.className?.toString().slice(0, 30)}`);
  }
  const styles = [...document.querySelectorAll('style')].filter(s => /\.discord-theme|--dsc-|dsc-/.test(s.textContent) && !s.closest('.dsc-settings-panel')).map(s => 'style#' + (s.id || '?'));
  return [...new Set([...out, ...styles])];
});
const toggle = async (on) => {
  await page.evaluate((on) => { const t = document.getElementById('dsc_enabled'); if (t.checked !== on) { t.checked = on; t.dispatchEvent(new Event('input', { bubbles: true })); } }, on);
  // turning on may reload the page
  await page.waitForTimeout(1500);
  await load();
};
await page.goto(URL, { waitUntil: 'domcontentloaded' });
await load();
// start from off, saved
await page.evaluate(() => { const s = SillyTavern.getContext().extensionSettings.discordTheme; s.enabled = false; SillyTavern.getContext().saveSettingsDebounced(); });
await page.waitForTimeout(2000);
await page.reload({ waitUntil: 'domcontentloaded' });
await load();
// open a chat so message-level things would show
await page.evaluate(async () => { const c = SillyTavern.getContext(); await c.selectCharacterById(c.characters.findIndex(x => x.name === 'Seraphina')); });
await page.waitForTimeout(2000);
const report = async (label) => { const l = await leaks(); console.log(`${label}: ${l.length} leaks`); for (const x of l.slice(0, 40)) console.log('   ', x); };
await report('off at load');
await toggle(true);
console.log('on:', await page.evaluate(() => document.body.classList.contains('discord-theme')), (await leaks()).length, 'dsc items (expected many)');
await toggle(false);
await page.evaluate(async () => { const c = SillyTavern.getContext(); if (!c.characterId) await c.selectCharacterById(c.characters.findIndex(x => x.name === 'Seraphina')); });
await page.waitForTimeout(1500);
await report('off live');
await toggle(true);
console.log('on again:', await page.evaluate(() => document.body.classList.contains('discord-theme')));
await toggle(false);
await report('off again');
// leave the test profile on, as other tests expect
await toggle(true);
console.log('errors', errors);
await browser.close();
