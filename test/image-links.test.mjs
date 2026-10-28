// Unit tests for lib/image-links.js. Run: node --test 'test/*.test.mjs'
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { findImageLinks, imagesLabel, isImageUrl, isOnlyImages } from '../lib/image-links.js';

test('image endings, with queries and hashes, any case', () => {
    for (const url of [
        'https://files.catbox.moe/abc123.png',
        'https://i.imgur.com/AbCd.JPG',
        'https://cdn.discordapp.com/attachments/1/2/pic.webp?ex=1&is=2&hm=3',
        'http://example.com/a/b.jpeg#frag',
        'https://example.com/anim.gif',
        'https://example.com/photo.avif',
    ]) {
        assert.equal(isImageUrl(url), true, url);
    }
});

test('not images: pages, other files, other protocols', () => {
    for (const url of [
        'https://imgur.com/gallery/abc',
        'https://example.com/file.pdf',
        'https://example.com/png',
        'javascript:alert(1).png',
        'data:image/png;base64,AAAA',
        'ftp://example.com/a.png',
        'not a url.png',
    ]) {
        assert.equal(isImageUrl(url), false, url);
    }
});

test('finds a bare link, keeping sentence punctuation out of it', () => {
    assert.deepEqual(findImageLinks('Look: https://files.catbox.moe/x1.png.'), [{ url: 'https://files.catbox.moe/x1.png', alt: '', markdown: false }]);
    assert.deepEqual(findImageLinks('(https://e.com/a.jpg)'), [{ url: 'https://e.com/a.jpg', alt: '', markdown: false }]);
});

test('finds markdown images with their alt text, once', () => {
    assert.deepEqual(findImageLinks('![a cat](https://e.com/cat.png) and again https://e.com/cat.png'),
        [{ url: 'https://e.com/cat.png', alt: 'a cat', markdown: true }]);
    assert.deepEqual(findImageLinks('![](<https://e.com/a b.png>)'), []);
    assert.deepEqual(findImageLinks('![x](https://e.com/a.png "title")'), [{ url: 'https://e.com/a.png', alt: 'x', markdown: true }]);
});

test('keeps order and ignores code', () => {
    assert.deepEqual(findImageLinks('https://e.com/1.png then ![two](https://e.com/2.gif)').map(x => x.url), ['https://e.com/1.png', 'https://e.com/2.gif']);
    assert.deepEqual(findImageLinks('`https://e.com/1.png` and ```\nhttps://e.com/2.png\n```'), []);
});

test('only images?', () => {
    assert.equal(isOnlyImages('https://files.catbox.moe/x1.png'), true);
    assert.equal(isOnlyImages('  ![cat](https://e.com/c.png)\n https://e.com/d.webp '), true);
    assert.equal(isOnlyImages('look https://e.com/c.png'), false);
    assert.equal(isOnlyImages('no links here'), false);
});

test('HTML image tags, bmp and apng', () => {
    assert.deepEqual(findImageLinks('<img src="https://e.com/a.webp" alt="hi">'), [{ url: 'https://e.com/a.webp', alt: 'hi', markdown: true }]);
    assert.equal(isImageUrl('https://e.com/a.bmp'), true);
    assert.equal(isImageUrl('https://e.com/a.apng'), true);
    assert.deepEqual(findImageLinks('<img src="javascript:alert(1)">'), []);
});

test('labels for picture-only messages', () => {
    assert.equal(imagesLabel('https://e.com/a.png'), 'Image');
    assert.equal(imagesLabel('https://e.com/a.png https://e.com/b.png'), '2 Images');
    assert.equal(imagesLabel('hi https://e.com/a.png'), '');
});
