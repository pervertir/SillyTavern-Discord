// Renders tools/social-preview.html to docs/social-preview.png (1280×640).
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium, BROWSER } from '../test/e2e/env.mjs';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const browser = await chromium.launch({ executablePath: BROWSER, headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 640 } });
await page.goto(pathToFileURL(path.join(ROOT, 'tools/social-preview.html')).href);
await page.waitForTimeout(500);
await page.screenshot({ path: path.join(ROOT, 'docs/social-preview.png') });
await browser.close();
console.log('wrote docs/social-preview.png');
