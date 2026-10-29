// Unit tests for lib/server-layout.js. Run: node --test 'test/*.test.mjs'
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { leaveFolder, locate, move, moveFolder, normalize, step, ungroup, updateFolder } from '../lib/server-layout.js';

const id = () => 'f1';

test('normalize keeps the order, drops gone servers, adds new ones at the end', () => {
    assert.deepEqual(normalize(['b', 'gone', 'a'], ['a', 'b', 'c']), ['b', 'a', 'c']);
    assert.deepEqual(normalize(undefined, ['a', 'b']), ['a', 'b']);
});

test('normalize dissolves folders left with one server, and drops empty ones', () => {
    const layout = [{ folder: 'f1', name: 'x', color: '', open: false, ids: ['a', 'gone'] }, { folder: 'f2', name: '', color: '', open: false, ids: ['gone'] }, 'b'];
    assert.deepEqual(normalize(layout, ['a', 'b']), ['a', 'b']);
});

test('dropping onto a server makes a folder of the two', () => {
    const out = move(['a', 'b', 'c'], 'c', 'a', 'into', id);
    assert.deepEqual(out, [{ folder: 'f1', name: '', color: '', open: false, ids: ['a', 'c'] }, 'b']);
});

test('dropping before or after a server reorders', () => {
    assert.deepEqual(move(['a', 'b', 'c'], 'c', 'a', 'before'), ['c', 'a', 'b']);
    assert.deepEqual(move(['a', 'b', 'c'], 'a', 'b', 'after'), ['b', 'a', 'c']);
});

test('dropping onto a folder, or a server in it, joins the folder', () => {
    const layout = [{ folder: 'f1', name: '', color: '', open: true, ids: ['a', 'b'] }, 'c', 'd'];
    assert.deepEqual(move(layout, 'c', 'f1', 'into')[0].ids, ['a', 'b', 'c']);
    assert.deepEqual(move(layout, 'd', 'a', 'after')[0].ids, ['a', 'd', 'b']);
});

test('dragging out of a two-server folder dissolves it', () => {
    const layout = [{ folder: 'f1', name: '', color: '', open: true, ids: ['a', 'b'] }, 'c'];
    assert.deepEqual(move(layout, 'a', 'c', 'after'), ['b', 'c', 'a']);
});

test('the layout given is never changed', () => {
    const layout = [{ folder: 'f1', name: '', color: '', open: true, ids: ['a', 'b'] }, 'c'];
    const before = JSON.stringify(layout);
    move(layout, 'c', 'a', 'into');
    step(layout, 'a', 1);
    leaveFolder(layout, 'a');
    assert.equal(JSON.stringify(layout), before);
});

test('step moves up and down, within a folder too', () => {
    assert.deepEqual(step(['a', 'b', 'c'], 'b', -1), ['b', 'a', 'c']);
    assert.deepEqual(step(['a', 'b', 'c'], 'a', -1), ['a', 'b', 'c']);
    const layout = [{ folder: 'f1', name: '', color: '', open: true, ids: ['a', 'b'] }];
    assert.deepEqual(step(layout, 'a', 1)[0].ids, ['b', 'a']);
});

test('leaving a folder puts the server right after it', () => {
    const layout = [{ folder: 'f1', name: '', color: '', open: true, ids: ['a', 'b', 'c'] }, 'd'];
    const out = leaveFolder(layout, 'b');
    assert.deepEqual(out[0].ids, ['a', 'c']);
    assert.deepEqual(out.slice(1), ['b', 'd']);
});

test('ungroup and rename', () => {
    const layout = ['x', { folder: 'f1', name: '', color: '', open: true, ids: ['a', 'b'] }, 'y'];
    assert.deepEqual(ungroup(layout, 'f1'), ['x', 'a', 'b', 'y']);
    assert.equal(updateFolder(layout, 'f1', { name: 'Friends' })[1].name, 'Friends');
    assert.deepEqual(locate(layout, 'b'), { index: 1, folder: 'f1', inner: 1 });
});

test('a folder moves as a whole', () => {
    const folder = { folder: 'f1', name: '', color: '', open: true, ids: ['a', 'b'] };
    assert.deepEqual(moveFolder([folder, 'c', 'd'], 'f1', 'd', 'after'), ['c', 'd', folder]);
    assert.deepEqual(moveFolder(['c', folder], 'f1', 'c', 'before'), [folder, 'c']);
});
