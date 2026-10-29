// Settings for the end-to-end checks (run by ../../tools/check.mjs). Override with environment
// variables on another machine.
export const URL = process.env.DSC_URL || 'http://127.0.0.1:8004/';
/** A Chromium-based browser, always driven headless */
export const BROWSER = process.env.DSC_BROWSER || '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser';
/** playwright-core, from wherever it's installed (it isn't a dependency of the extension) */
const PLAYWRIGHT = process.env.DSC_PLAYWRIGHT || '/Volumes/980Pro/tmp-st-discord/tools/node_modules/playwright-core/index.mjs';
export const { chromium } = await import(PLAYWRIGHT);
