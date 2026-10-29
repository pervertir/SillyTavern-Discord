import { chromium, BROWSER, URL } from './env.mjs';
const browser = await chromium.launch({ executablePath: BROWSER, headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(URL, { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => document.querySelector('#dsc-side .dsc-dm') && !document.body.classList.contains('dsc-booting'), null, { timeout: 40000 });
await page.waitForTimeout(800);
await page.click('#dsc-side .dsc-dm >> nth=0'); await page.waitForTimeout(1200);
await page.click('#dsc-user .dsc-user-tool >> nth=2'); await page.waitForTimeout(600);
await page.evaluate(() => {
  window.__log = [];
  const log = (m) => window.__log.push(`${Math.round(performance.now())} ${m}`);
  new MutationObserver(ms => ms.forEach(m => { if (m.attributeName === 'class') log(`${m.target.id || m.target.className.toString().slice(0, 30)}: ${m.oldValue?.match(/openDrawer|closedDrawer|dsc-settings-open|dsc-editor-open/g)} -> ${m.target.className.toString().match(/openDrawer|closedDrawer|dsc-settings-open|dsc-editor-open/g)}`); }))
    .observe(document.body, { attributes: true, attributeOldValue: true, subtree: true, attributeFilter: ['class'] });
  const overlay = document.getElementById('dsc-settings');
  let last = '';
  const sample = () => { const v = getComputedStyle(overlay).display + '/' + (document.querySelector('#top-settings-holder .drawer-content.openDrawer')?.id ?? 'none'); if (v !== last) { log('frame ' + v); last = v; } requestAnimationFrame(sample); };
  sample();
});
const steps = [
  ['sidebar Appearance', () => page.locator('#dsc-settings .dsc-set-item', { hasText: 'Appearance' }).first().click()],
  ['checkbox row', () => page.locator('.drawer-content.openDrawer label.checkbox_label:visible').first().click()],
  ['select', () => page.locator('.drawer-content.openDrawer select:visible').first().click()],
  ['swatch Ash', () => page.locator('#dsc-appearance .dsc-swatch[aria-label="Ash"]').click()],
  ['inline drawer', () => page.locator('.drawer-content.openDrawer .inline-drawer-toggle:visible').first().click()],
  ['sidebar Chat', () => page.locator('#dsc-settings .dsc-set-item', { hasText: 'Chat' }).first().click()],
  ['empty main area', () => page.mouse.click(1350, 600)],
  ['sidebar empty', () => page.mouse.click(100, 850)],
];
for (const [name, run] of steps) {
  await page.evaluate((n) => window.__log.push('--- ' + n), name);
  await run(); await page.waitForTimeout(700);
}
console.log((await page.evaluate(() => window.__log)).filter(l => !/null -> null/.test(l)).join('\n'));
await page.locator('#dsc-appearance .dsc-swatch[aria-label="Dark"]').click().catch(() => {});
await browser.close();
