// The clean SillyTavern test server, started for a test run and stopped after it. Never opens a
// browser tab (--browserLaunchEnabled false). Settings: DSC_ST_DIR, DSC_DATA, DSC_PORT.
import { spawn } from 'node:child_process';

const ST_DIR = process.env.DSC_ST_DIR || '/Volumes/980Pro/Workspace/AI/SillyTavern';
const DATA = process.env.DSC_DATA || '/Volumes/980Pro/tmp-st-discord/data';
export const PORT = process.env.DSC_PORT || '8004';
export const SERVER_URL = `http://127.0.0.1:${PORT}/`;

async function reachable() {
    try {
        return (await fetch(SERVER_URL)).ok;
    } catch {
        return false;
    }
}

/** Starts the server and waits until it answers; returns a function that stops it. */
export async function startTestServer() {
    if (await reachable()) {
        throw new Error(`Something is already serving port ${PORT}; stop it first.`);
    }
    const server = spawn('node', ['server.js', '--port', PORT, '--dataRoot', DATA, '--listen', 'false', '--basicAuthMode', 'false', '--browserLaunchEnabled', 'false'], { cwd: ST_DIR, stdio: 'ignore' });
    const stop = () => {
        if (server.exitCode === null && !server.killed) {
            server.kill();
        }
    };
    process.on('exit', stop);
    for (let i = 0; i < 90; i++) {
        if (await reachable()) {
            return stop;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    stop();
    throw new Error('The test server did not start.');
}
