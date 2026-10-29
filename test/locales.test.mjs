// The theme's words and their translations. Run: node --test 'test/*.test.mjs'
import assert from 'node:assert/strict';
import { test } from 'node:test';
import fs from 'node:fs';
import { collect } from '../tools/strings.mjs';

const dir = new URL('../locales/', import.meta.url);
const english = JSON.parse(fs.readFileSync(new URL('en.json', dir), 'utf8'));
const keys = Object.keys(english);

test('locales/en.json has every string the code shows, and no others (run node tools/strings.mjs --write)', () => {
    assert.deepEqual(keys.slice().sort(), collect().slice().sort());
});

for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.json') && f !== 'en.json')) {
    test(`${file} translates every string, and only those`, () => {
        const data = JSON.parse(fs.readFileSync(new URL(file, dir), 'utf8'));
        const missing = keys.filter(k => !(k in data) || typeof data[k] !== 'string' || !data[k].trim());
        const extra = Object.keys(data).filter(k => !(k in english));
        assert.deepEqual(missing, [], `missing in ${file}`);
        assert.deepEqual(extra, [], `unknown keys in ${file}`);
    });
}
