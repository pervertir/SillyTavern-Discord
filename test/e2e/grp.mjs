import { chromium, BROWSER, URL } from './env.mjs';
const browser = await chromium.launch({ executablePath: BROWSER, headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = []; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto(URL, { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => document.querySelector('#dsc-side .dsc-dm') && !document.body.classList.contains('dsc-booting'), null, { timeout: 40000 });
await page.waitForTimeout(1000);
// a fresh chat with Flux the Cat (test profile only)
await page.click('#dsc-side .dsc-dm >> nth=2');
await page.waitForTimeout(2000);
await page.evaluate(async () => {
  const ctx = SillyTavern.getContext();
  await ctx.executeSlashCommandsWithOptions('/newchat');
});
await page.waitForTimeout(2500);
await page.evaluate(async () => {
  const ctx = SillyTavern.getContext();
  for (const cmd of ['/send Hey Flux!', '/send Are you on the Roomba again?', '/sendas name="Flux the Cat" *stares*', '/sendas name="Flux the Cat" Mrrp.', '/send ok']) {
    await ctx.executeSlashCommandsWithOptions(cmd);
  }
});
await page.waitForTimeout(1500);
console.log(JSON.stringify(await page.evaluate(() => [...document.querySelectorAll('#chat > .mes')].map(m => [m.getAttribute('ch_name'), m.classList.contains('dsc-cont') ? 'cont' : 'head', m.dataset.dscDay || '', m.querySelector('.timestamp')?.dataset.dscTime, Math.round(m.getBoundingClientRect().height)].join(' | ')))));
// keyboard: Alt+Up moves to the previous DM, Ctrl/Cmd+Alt+Down to the server
await page.locator('body').click({ position: { x: 700, y: 400 } });
await page.keyboard.press('Alt+ArrowUp');
await page.waitForTimeout(2000);
console.log('after Alt+Up:', await page.evaluate(() => document.querySelector('#dsc-head .dsc-head-name').textContent));
await page.keyboard.press('Meta+Alt+ArrowDown');
await page.waitForTimeout(2500);
console.log('after Mod+Alt+Down:', await page.evaluate(() => [document.querySelector('#dsc-head .dsc-head-name').textContent, document.title]));
await page.keyboard.press('Meta+Slash');
await page.waitForTimeout(800);
console.log('keybinds popup:', await page.evaluate(() => !!document.querySelector('dialog.popup[open] .dsc-keybinds')));
await page.keyboard.press('Escape');
await page.waitForTimeout(400);
await page.keyboard.press('Meta+Comma');
await page.waitForTimeout(900);
console.log('settings:', await page.evaluate(() => [document.body.classList.contains('dsc-settings-open'), document.querySelector('.dsc-set-title').textContent]));
await page.keyboard.press('Escape');
await page.waitForTimeout(900);
console.log('after Esc:', await page.evaluate(() => document.body.classList.contains('dsc-settings-open')));
console.log('errors', errors);
await browser.close();
