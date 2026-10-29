import { chromium, BROWSER, URL } from './env.mjs';
const browser = await chromium.launch({ executablePath: BROWSER, headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = []; page.on('pageerror', e => errors.push(e.message));
const ready = async () => { await page.waitForFunction(() => window.SillyTavern && document.querySelector('#send_textarea') && !document.body.classList.contains('dsc-booting') && document.getElementById('dsc_enabled'), null, { timeout: 40000 }); await page.waitForTimeout(1500); };
const snap = () => page.evaluate(() => {
  const box = s => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height), cs.display, cs.backgroundColor, cs.fontFamily.slice(0, 30)].join(' '); };
  const out = {};
  for (const s of ['#top-bar', '#top-settings-holder', '#sheld', '#chat', '#form_sheld', '#send_form', '#send_textarea', '#leftSendForm', '#rightSendForm', '#extensionsMenuButton', '#options_button', '#ai-config-button .drawer-toggle', '#rightNavHolder .drawer-toggle', '#version_display', '#bg1']) out[s] = box(s);
  out.title = document.title;
  out.icons = [...document.querySelectorAll('link[rel~="icon"]')].map(l => l.getAttribute('href') + '|' + l.getAttribute('type'));
  out.placeholder = document.getElementById('send_textarea').getAttribute('placeholder');
  out.visibleOurs = [...document.querySelectorAll('[id^="dsc-"], [class*="dsc-"]')].filter(e => e.getBoundingClientRect().width > 0 && !e.closest('.dsc-settings-panel')).map(e => e.id || e.className).slice(0, 10);
  out.bodyDsc = [...document.body.classList].filter(c => c.startsWith('dsc') || c === 'discord-theme');
  out.htmlDsc = document.documentElement.className;
  out.titles = [...document.querySelectorAll('#top-settings-holder .drawer-toggle')].map(e => e.getAttribute('title')).join('|').slice(0, 120);
  out.mes = [...document.querySelectorAll('#chat .mes')].map(m => m.className).slice(0, 3);
  return out;
});
await page.goto(URL, { waitUntil: 'domcontentloaded' });
await ready();
await page.evaluate(() => { const b = document.getElementById('dsc_enabled'); if (!b.checked) b.click(); b.click(); });
await page.waitForTimeout(2500);
const toggled = await snap();
await page.reload({ waitUntil: 'domcontentloaded' });
await ready();
const fresh = await snap();
let same = true;
for (const k of Object.keys(fresh)) { if (JSON.stringify(fresh[k]) !== JSON.stringify(toggled[k])) { same = false; console.log('DIFF', k, '\n  off-at-runtime:', JSON.stringify(toggled[k]), '\n  fresh-off:     ', JSON.stringify(fresh[k])); } }
console.log('same:', same, 'errors:', errors);
console.log(JSON.stringify(fresh, null, 1).slice(0, 1500));
// turn it back on for the test profile
await page.evaluate(() => document.getElementById('dsc_enabled').click());
await page.waitForTimeout(2500);
console.log('back on:', await page.evaluate(() => document.body.classList.contains('discord-theme')));
await browser.close();
