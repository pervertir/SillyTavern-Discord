// Unit tests for lib/emoji-data.js. Run: node --test 'test/*.test.mjs'
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { EMOJI_CATEGORIES, searchEmoji } from '../lib/emoji-data.js';

test('every entry has one emoji and some words', () => {
    for (const category of EMOJI_CATEGORIES) {
        assert.ok(category.emoji.length > 20, category.name);
        for (const item of category.emoji) {
            assert.ok(item.char && !/\s/.test(item.char), `${category.name}: ${item.char}`);
            assert.ok(/^[a-z0-9 '\-]+$/.test(item.words), `${category.name}: ${item.char} ${item.words}`);
        }
    }
});

test('search finds by the start of a word first', () => {
    const found = searchEmoji('heart').map(x => x.char);
    assert.ok(found.includes('❤️'));
    assert.ok(found.includes('😍'));
    assert.equal(searchEmoji('thumbs')[0].char, '👍');
    assert.deepEqual(searchEmoji(''), []);
    assert.deepEqual(searchEmoji('zzzzqq'), []);
});
