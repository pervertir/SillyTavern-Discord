// Accessibility audit of the theme's own UI, without downloads: names for controls, alt for
// pictures, text contrast (WCAG AA) per theme, and visible keyboard focus.
import { chromium, BROWSER, URL } from './env.mjs';
const browser = await chromium.launch({ executablePath: BROWSER, headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = []; page.on('pageerror', e => errors.push(e.message));
await page.goto(URL, { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => document.querySelector('#dsc-side .dsc-dm') && !document.body.classList.contains('dsc-booting') && document.getElementById('dsc_appearance'), null, { timeout: 60000 });
await page.waitForTimeout(800);
await page.locator('#dsc-side .dsc-dm', { hasText: 'Seraphina' }).first().click();
await page.waitForTimeout(1500);
const audit = () => page.evaluate(() => {
  const ours = e => !!e.closest('[id^="dsc-"]');
  const visible = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && +cs.opacity > 0; };
  const nameOf = e => (e.getAttribute('aria-label') || e.getAttribute('title') || e.textContent || e.getAttribute('placeholder') || (e.id && document.querySelector(`label[for="${e.id}"]`)?.textContent) || e.closest('label')?.textContent || '').trim();
  const describe = e => `${e.tagName.toLowerCase()}${e.id ? '#' + e.id : ''}.${String(e.className).split(' ').slice(0, 2).join('.')}`;
  const unnamed = [...document.querySelectorAll('button, [role="button"], a[href], input:not([type="hidden"]), select, textarea')].filter(e => ours(e) && visible(e) && !nameOf(e)).map(describe);
  const noAlt = [...document.querySelectorAll('img')].filter(e => ours(e) && visible(e) && !e.hasAttribute('alt')).map(describe);
  // contrast
  const parse = c => { const m = c.match(/[\d.]+/g); return m ? m.map(Number) : [0, 0, 0, 0]; };
  const lum = ([r, g, b]) => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const bgOf = e => { let n = e; while (n) { const c = parse(getComputedStyle(n).backgroundColor); const img = getComputedStyle(n).backgroundImage; if (img && img !== 'none') return null; if ((c[3] ?? 1) > 0.9) return c; n = n.parentElement; } return [255, 255, 255, 1]; };
  const low = [];
  for (const e of document.querySelectorAll('[id^="dsc-"] *')) {
    if (!visible(e) || e.closest('[aria-hidden="true"]') || ![...e.childNodes].some(n => n.nodeType === 3 && n.nodeValue.trim())) continue;
    const bg = bgOf(e); if (!bg) continue;
    const cs = getComputedStyle(e); const fg = parse(cs.color);
    if ((fg[3] ?? 1) < 0.5) continue;
    const [a, b] = [lum(fg), lum(bg)].sort((x, y) => y - x); const ratio = (a + 0.05) / (b + 0.05);
    const large = parseFloat(cs.fontSize) >= 24 || (parseFloat(cs.fontSize) >= 18.66 && +cs.fontWeight >= 700);
    if (ratio < (large ? 3 : 4.5)) low.push(`${ratio.toFixed(2)} "${e.textContent.trim().slice(0, 24)}" ${describe(e)}`);
  }
  return { unnamed, noAlt, low: [...new Set(low)] };
});
const set = (id, v) => page.evaluate(([id, v]) => { const e = document.getElementById(id); e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, [id, v]);
for (const look of ['dark', 'ash', 'onyx', 'light']) {
  await set('dsc_appearance', look); await page.waitForTimeout(500);
  const r = await audit();
  console.log(`== ${look}: ${r.unnamed.length} unnamed controls, ${r.noAlt.length} pictures without alt, ${r.low.length} low-contrast texts`);
  if (look === 'dark') { r.unnamed.slice(0, 25).forEach(x => console.log('  unnamed', x)); r.noAlt.slice(0, 10).forEach(x => console.log('  no alt', x)); }
  r.low.slice(0, 20).forEach(x => console.log('  contrast', x));
}
await set('dsc_appearance', 'dark');
// other surfaces: settings pages, the profile card, a menu, the emoji picker
const report = async (label) => { const r = await audit(); console.log(`== ${label}: ${r.unnamed.length} unnamed, ${r.noAlt.length} no alt, ${r.low.length} low contrast`); [...r.unnamed.slice(0, 12).map(x => '  unnamed ' + x), ...r.noAlt.slice(0, 5).map(x => '  no alt ' + x), ...r.low.slice(0, 12).map(x => '  contrast ' + x)].forEach(x => console.log(x)); };
await page.evaluate(() => document.querySelector('#dsc-user .dsc-user-tool:last-child').click()); await page.waitForTimeout(600);
for (const sel of ['[data-page="customize"]', '[data-page="notifications"]', '[data-page="keybinds"]', '[data-drawer="sys-settings-button"]']) {
  await page.click(`.dsc-set-item${sel}`); await page.waitForTimeout(800);
  await report('settings ' + sel);
}
await page.keyboard.press('Escape'); await page.waitForTimeout(400);
await page.locator('#chat .mes[is_user="false"] .avatar').first().click(); await page.waitForTimeout(400);
await report('profile popout');
await page.keyboard.press('Escape');
await page.locator('#chat .mes .mes_text').first().click({ button: 'right' }); await page.waitForTimeout(300);
await report('message menu');
await page.keyboard.press('Escape');
await page.click('#dsc-compose-tools .dsc-compose-emoji'); await page.waitForTimeout(300);
await report('emoji picker');
await page.keyboard.press('Escape');
// keyboard: tab through and check each focused element shows an outline or ring
await page.evaluate(() => document.activeElement?.blur());
const noRing = [];
for (let i = 0; i < 40; i++) {
  await page.keyboard.press('Tab');
  const r = await page.evaluate(() => { const e = document.activeElement; if (!e || e === document.body || !e.closest('[id^="dsc-"]')) return null; const cs = getComputedStyle(e); const ring = (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) || cs.boxShadow !== 'none'; return ring ? null : `${e.tagName.toLowerCase()}.${String(e.className).split(' ').slice(0, 2).join('.')} "${(e.getAttribute('aria-label') || e.textContent || '').trim().slice(0, 20)}"`; });
  if (r) noRing.push(r);
}
console.log(`== keyboard: ${noRing.length} focused controls without a visible ring`); [...new Set(noRing)].slice(0, 15).forEach(x => console.log('  no ring', x));
await page.waitForTimeout(1000);
console.log('errors', errors);
await browser.close();
