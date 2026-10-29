// The check to run before every push (the pre-push hook runs it; or `npm run check`):
// 1. unit tests;
// 2. a clean SillyTavern test server is started on its own port, used, and stopped again;
// 3. with it, headless only: the theme leaves zero traces while off (off at load, turned off
//    live, turned off again), and the regression scripts (theme off vs. fresh load, shortcuts
//    and grouping, settings and sheets, settings flash).
// It never touches any other SillyTavern server. Settings: test/e2e/env.mjs and the DSC_* variables.

import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const ST_DIR = process.env.DSC_ST_DIR || '/Volumes/980Pro/Workspace/AI/SillyTavern';
const DATA = process.env.DSC_DATA || '/Volumes/980Pro/tmp-st-discord/data';
const PORT = process.env.DSC_PORT || '8004';
const URL = `http://127.0.0.1:${PORT}/`;
const SCRIPTS = ['leaks', 'off', 'grp', 'bugs', 'flash'];
/** Output that means a script found a problem */
const FAILED = /: [1-9]\d* leaks|same: false|errors \[\s*'|errors: \[\s*'|TimeoutError|Error: /;

function run(cmd, args, options = {}) {
    const result = spawnSync(cmd, args, { encoding: 'utf8', timeout: 240000, ...options });
    return { code: result.status, out: `${result.stdout ?? ''}${result.stderr ?? ''}` };
}

async function reachable() {
    try {
        return (await fetch(URL)).ok;
    } catch {
        return false;
    }
}

async function waitUp() {
    for (let i = 0; i < 90; i++) {
        if (await reachable()) {
            return true;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    return false;
}

let failed = false;
const unit = run('node', ['--test', 'test/*.test.mjs'], { cwd: ROOT });
console.log(unit.out.split('\n').filter(line => /^ℹ (pass|fail)/.test(line)).join('\n'));
failed ||= unit.code !== 0;

if (await reachable()) {
    console.error(`Something is already serving port ${PORT}; stop it first (the check starts its own).`);
    process.exit(1);
}
const server = spawn('node', ['server.js', '--port', PORT, '--dataRoot', DATA, '--listen', 'false', '--basicAuthMode', 'false', '--browserLaunchEnabled', 'false'], { cwd: ST_DIR, stdio: 'ignore' });
const stop = () => {
    if (server.exitCode === null && !server.killed) {
        server.kill();
    }
};
process.on('exit', stop);
process.on('SIGINT', () => process.exit(130));

try {
    if (!await waitUp()) {
        console.error('The test server did not start.');
        failed = true;
    } else {
        for (const name of SCRIPTS) {
            const result = run('node', [path.join(ROOT, 'test/e2e', `${name}.mjs`)], { cwd: path.join(ROOT, 'test/e2e'), env: { ...process.env, DSC_URL: URL } });
            const bad = result.code !== 0 || FAILED.test(result.out);
            failed ||= bad;
            console.log(`${bad ? '✗' : '✓'} ${name}`);
            if (bad) {
                console.log(result.out.split('\n').filter(line => !/^\s+-/.test(line)).slice(-25).join('\n'));
            }
        }
    }
} finally {
    stop();
}
console.log(failed ? 'Check failed.' : 'All checks passed.');
process.exit(failed ? 1 : 0);
