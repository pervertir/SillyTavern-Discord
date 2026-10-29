// Takes the README's screenshots on the clean test profile (sample characters only): desktop and
// phone; Dark, Light and a Nitro theme; the key screens. Writes PNGs to docs/screenshots/raw/;
// convert them with: for f in docs/screenshots/raw/*.png; do cwebp -q 85 "$f" -o docs/screenshots/$(basename "$f" .png).webp; done
// node tools/gallery.mjs starts the test server itself and stops it when done.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, BROWSER } from '../test/e2e/env.mjs';
import { SERVER_URL as URL, startTestServer } from './test-server.mjs';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const OUT = path.join(ROOT, 'docs/screenshots/raw');
fs.mkdirSync(OUT, { recursive: true });

const stopServer = await startTestServer();
const browser = await chromium.launch({ executablePath: BROWSER, headless: true });
const errors = [];

async function open(width, height, mobile = false) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: mobile ? 2 : 1, isMobile: mobile, hasTouch: mobile });
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(URL, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.querySelector('#dsc-side .dsc-dm') && !document.body.classList.contains('dsc-booting') && document.getElementById('dsc_appearance'), null, { timeout: 60000 });
    await page.waitForTimeout(1200);
    return page;
}

const look = (page, base, nitro = '') => page.evaluate(([b, n]) => {
    for (const [id, v] of [['dsc_appearance', b], ['dsc_nitro', n]]) {
        const e = document.getElementById(id);
        e.value = v;
        e.dispatchEvent(new Event('input', { bubbles: true }));
    }
}, [base, nitro]);

const shot = async (page, name) => {
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(OUT, `${name}.png`) });
    console.log('shot', name);
};

const theme = '/scripts/extensions/third-party/SillyTavern-Discord-dev/';

// ---------- desktop ----------
const page = await open(1440, 900);
await look(page, 'dark');
// a chat with a reply split into short messages, and the typing dots
await page.locator('#dsc-side .dsc-dm', { hasText: 'Seraphina' }).first().click();
await page.waitForTimeout(1500);
await page.evaluate(async () => {
    const c = SillyTavern.getContext();
    await c.executeSlashCommandsWithOptions('/newchat');
    await new Promise(r => setTimeout(r, 1200));
    await c.executeSlashCommandsWithOptions('/send Morning! Did you sleep at all?');
    await c.executeSlashCommandsWithOptions('/sendas name="Seraphina" *She stretches and smiles.* Barely, honestly. The owls were loud all night. But the tea helped! Want some? I made a fresh pot.');
    // || is a pipe in slash commands, so the spoiler's bars are escaped
    await c.executeSlashCommandsWithOptions('/send Yes please. \\|\\|And then you can tell me about the owls.\\|\\|');
});
await page.waitForTimeout(1500);
await page.evaluate(async (base) => { const presence = await import(`${base}presence.js`); presence.showTyping?.('Seraphina'); }, theme);
await shot(page, 'chat-dark');
await page.evaluate(async (base) => { const presence = await import(`${base}presence.js`); presence.hideTyping?.(); }, theme);

// the profile popout
await page.locator('#chat .mes[is_user="false"] .avatar').last().click();
await shot(page, 'profile-popout');
await page.keyboard.press('Escape');

// pinned messages
await page.locator('#chat .mes[is_user="false"] .mes_text').last().click({ button: 'right' });
await page.locator('#dsc-menu').getByText('Pin Message').click();
await page.locator('#dsc-head .dsc-tool-pin').click();
await shot(page, 'pins');
await page.keyboard.press('Escape');

// search
await page.fill('.dsc-head-search input', 'tea');
await page.press('.dsc-head-search input', 'Enter');
await shot(page, 'search');
await page.press('.dsc-head-search input', 'Escape');

// a server with its member list, and folders in the rail (sample servers, in memory only)
await page.evaluate(() => {
    const c = SillyTavern.getContext();
    const g = c.groups[0];
    for (const [i, n] of ['Book Club', 'Game Night', 'Study Group'].entries()) c.groups.push({ ...g, id: `g${i}`, name: n, avatar_url: '', chats: [] });
    c.extensionSettings.discordTheme.serverLayout = [String(g.id), { folder: 'f1', name: 'Friends', color: '#57f287', open: true, ids: ['g0', 'g1'] }, 'g2'];
    c.eventSource.emit(c.eventTypes.GROUP_UPDATED);
});
await page.locator('#dsc-guilds .dsc-server').first().click();
await page.waitForTimeout(2000);
await page.evaluate(() => document.body.classList.add('dsc-aside-on'));
await shot(page, 'server-members');

// User Settings: Appearance, in Light
await look(page, 'light');
await page.evaluate(() => document.querySelector('#dsc-user .dsc-user-tool:last-child').click());
await page.waitForTimeout(600);
await page.click('.dsc-set-item[data-part="UI-Theme-Block"]');
await shot(page, 'settings-light');
// Customize
await look(page, 'dark');
await page.click('.dsc-set-item[data-page="customize"]');
await shot(page, 'customize');
await page.keyboard.press('Escape');
await page.waitForTimeout(500);

// Add Server
await page.evaluate(() => document.querySelector('#dsc-guilds .dsc-add button').click());
await page.waitForTimeout(1000);
await page.fill('#rm_group_chat_name', 'Writing Club');
await page.evaluate(() => document.querySelector('#rm_group_add_members .group_member [data-action="add"]')?.click());
await shot(page, 'add-server');
await page.keyboard.press('Escape');
await page.waitForTimeout(500);

// a Nitro color theme
await look(page, 'dark', 'chroma-glow');
await page.evaluate(() => document.querySelector('#dsc-guilds .dsc-home button').click());
await page.waitForTimeout(600);
await page.locator('#dsc-side .dsc-dm', { hasText: 'Seraphina' }).first().click();
await page.waitForTimeout(1500);
await shot(page, 'nitro');
await look(page, 'dark');
// leave the sample servers out of the saved settings
await page.evaluate(() => { const c = SillyTavern.getContext(); c.groups.splice(1); c.extensionSettings.discordTheme.serverLayout = []; c.saveSettingsDebounced(); });
await page.waitForTimeout(1500);
await page.close();

// ---------- phone ----------
const phone = await open(390, 844, true);
await look(phone, 'dark');
await phone.waitForTimeout(400);
await shot(phone, 'phone-home');
await phone.locator('#dsc-side .dsc-dm', { hasText: 'Seraphina' }).first().tap();
await phone.waitForTimeout(1800);
await shot(phone, 'phone-chat');
await look(phone, 'light');
await phone.evaluate(() => document.querySelector('.dsc-tab[data-tab="you"]')?.click());
await phone.waitForTimeout(800);
await shot(phone, 'phone-settings-light');
await look(phone, 'dark');
await phone.waitForTimeout(1200);
await phone.close();

console.log('errors', errors.slice(0, 5));
await browser.close();
stopServer();
