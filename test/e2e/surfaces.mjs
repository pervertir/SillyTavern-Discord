// Surfaces: no gradient, shadow, blur or text shadow on the containers around the forms in the
// settings panes and the server editor (in Dark and a dark Nitro theme), and the bottom-left corner
// under your panel belongs to the server rail.
import { chromium, BROWSER, URL } from './env.mjs';
const browser = await chromium.launch({ executablePath: BROWSER, headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = []; page.on('pageerror', e => errors.push(e.message));
await page.goto(URL, { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => document.querySelector('#dsc-side .dsc-dm') && !document.body.classList.contains('dsc-booting') && document.getElementById('dsc_nitro'), null, { timeout: 60000 });
await page.waitForTimeout(800);

const scan = (label) => page.evaluate((label) => {
  const out = new Set();
  const visible = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 4 && r.height > 4 && cs.display !== 'none' && cs.visibility !== 'hidden'; };
  const name = e => `${e.tagName.toLowerCase()}${e.id ? '#' + e.id : ''}${e.classList.length ? '.' + [...e.classList].slice(0, 3).join('.') : ''}`;
  const roots = [...document.querySelectorAll('#top-settings-holder .drawer-content.openDrawer, #right-nav-panel.openDrawer, .dsc-page.dsc-page-active')].filter(visible);
  const check = (e, pseudo) => {
    if (e.matches('input, select, textarea, button, label, .menu_button, .menu_button *, .right_menu_button, [role="button"], img, svg, svg *, kbd, .dsc-swatch, .dsc-status, .avatar, .avatar *, .dsc-avatar, .dsc-avatar *')) return;
    const cs = getComputedStyle(e, pseudo);
    if (pseudo && (cs.content === 'none' || cs.content === 'normal')) return;
    const bad = [];
    if (/gradient/.test(cs.backgroundImage) && !e.matches('.BGSampleTitle, ' + 'input[type="range"], .neo-range-slider, .dsc-swatch, .dsc-swatch *, .dsc-cz-preview, .dsc-cz-preview *, .dsc-prof-banner, .dsc-ap-swatch, [class*="nitro"]')) bad.push('gradient');
    if (cs.boxShadow !== 'none' && !e.matches(':focus, :focus-visible')) bad.push('shadow ' + cs.boxShadow.slice(0, 40));
    if (cs.backdropFilter && cs.backdropFilter !== 'none') bad.push('blur');
    if (cs.textShadow !== 'none') bad.push('text-shadow');
    const bg = cs.backgroundColor.match(/[\d.]+/g)?.map(Number);
    if (bad.length) out.add(`${name(e)}${pseudo ?? ''}: ${bad.join(', ')}`);
  };
  for (const root of roots) {
    let a = root;
    while (a && a !== document.body) { check(a); a = a.parentElement; }
    for (const e of [root, ...root.querySelectorAll('*')]) { if (!visible(e)) continue; check(e); check(e, '::before'); check(e, '::after'); }
  }
  return [label, [...out]];
}, label);
const show = ([label, items]) => { console.log(`== ${label}: ${items.length} painted surfaces`); items.slice(0, 30).forEach(x => console.log('  ' + x)); };
for (const nitro of ['', 'aurora']) {
  await page.evaluate((n) => { const e = document.getElementById('dsc_nitro'); e.value = n; e.dispatchEvent(new Event('input', { bubbles: true })); }, nitro);
  await page.waitForTimeout(500);
  const corner = await page.evaluate(() => { const e = document.elementFromPoint(4, innerHeight - 3); return e?.closest('#dsc-guilds') ? 'rail' : (e?.id || e?.tagName); });
  console.log(`== corner ${nitro || 'dark'}: ${corner === 'rail' ? 0 : 1} corner problems (${corner})`);
  await page.evaluate(() => document.querySelector('#dsc-user .dsc-user-tool:last-child').click()); await page.waitForTimeout(600);
  for (const sel of ['[data-part="UI-Theme-Block"]', '[data-part="power-user-options-block"]', '[data-part="UI-Customization"]', '[data-drawer="ai-config-button"]', '[data-part="ContextSettings"]', '[data-drawer="sys-settings-button"]', '[data-drawer="WI-SP-button"]', '[data-drawer="extensions-settings-button"]', '[data-drawer="backgrounds-button"]', '[data-drawer="persona-management-button"]', '[data-page="customize"]', '[data-page="notifications"]']) {
    await page.click(`.dsc-set-item${sel}`); await page.waitForTimeout(700);
    show(await scan(`${nitro || 'dark'} ${sel}`));
  }
  await page.keyboard.press('Escape'); await page.waitForTimeout(400);
  await page.evaluate(() => document.querySelector('#dsc-guilds .dsc-add button').click()); await page.waitForTimeout(1000);
  show(await scan(`${nitro || 'dark'} add server`));
  await page.keyboard.press('Escape'); await page.waitForTimeout(500);
}
await page.evaluate(() => { const e = document.getElementById('dsc_nitro'); e.value = ''; e.dispatchEvent(new Event('input', { bubbles: true })); });
await page.waitForTimeout(800);
console.log('errors', errors);
await browser.close();
