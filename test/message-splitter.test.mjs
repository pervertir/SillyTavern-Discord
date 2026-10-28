// Unit tests for lib/message-splitter.js. Run: node --test test/
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { splitMessage } from '../lib/message-splitter.js';

const one = { maxSentences: 1 };

test('empty and blank text give no parts', () => {
    assert.deepEqual(splitMessage(''), []);
    assert.deepEqual(splitMessage('   \n  '), []);
    assert.deepEqual(splitMessage(null), []);
});

test('a single sentence stays whole', () => {
    assert.deepEqual(splitMessage('Hello there.'), ['Hello there.']);
    assert.deepEqual(splitMessage('No punctuation at all'), ['No punctuation at all']);
});

test('splits after . ! ? and groups two sentences per part', () => {
    assert.deepEqual(splitMessage('One. Two! Three? Four.'), ['One. Two!', 'Three? Four.']);
    assert.deepEqual(splitMessage('One. Two! Three? Four.', one), ['One.', 'Two!', 'Three?', 'Four.']);
});

test('runs of end marks stay with their sentence', () => {
    assert.deepEqual(splitMessage('Really?! Yes!!! Well... Okay.', one), ['Really?!', 'Yes!!!', 'Well...', 'Okay.']);
});

test('an ellipsis running on in lower case does not split', () => {
    assert.deepEqual(splitMessage('I was thinking… maybe not. Fine.', one), ['I was thinking… maybe not.', 'Fine.']);
    assert.deepEqual(splitMessage('Well... you know. Sure.', one), ['Well... you know.', 'Sure.']);
});

test('CJK sentence ends split without spaces', () => {
    assert.deepEqual(splitMessage('你好。今天怎么样？很好！', one), ['你好。', '今天怎么样？', '很好！']);
});

test('abbreviations, initials, decimals, URLs and e-mails do not split', () => {
    assert.deepEqual(splitMessage('Mr. Smith met Dr. Jones. They talked.', one), ['Mr. Smith met Dr. Jones.', 'They talked.']);
    assert.deepEqual(splitMessage('Bring snacks, e.g. chips. Thanks.', one), ['Bring snacks, e.g. chips.', 'Thanks.']);
    assert.deepEqual(splitMessage('Apples, pears etc. are fine. Okay.', one), ['Apples, pears etc. are fine.', 'Okay.']);
    assert.deepEqual(splitMessage('J. R. R. Tolkien wrote it. Wow.', one), ['J. R. R. Tolkien wrote it.', 'Wow.']);
    assert.deepEqual(splitMessage('Pi is 3.14 and it costs 1.5k. Neat.', one), ['Pi is 3.14 and it costs 1.5k.', 'Neat.']);
    assert.deepEqual(splitMessage('See https://example.com/a.b?x=1. Then mail me@example.com. Bye.', one),
        ['See https://example.com/a.b?x=1.', 'Then mail me@example.com.', 'Bye.']);
});

test('never splits inside quotes; an end before a closing quote splits after it', () => {
    assert.deepEqual(splitMessage('He said, "Stop. Now." Then he left.', one), ['He said, "Stop. Now."', 'Then he left.']);
    assert.deepEqual(splitMessage('“Are you sure?” she asked. Yes.', one), ['“Are you sure?” she asked.', 'Yes.']);
    assert.deepEqual(splitMessage('She whispered “Run.” He ran.', one), ['She whispered “Run.”', 'He ran.']);
    assert.deepEqual(splitMessage('«Bonjour. Ça va?» Oui.', one), ['«Bonjour. Ça va?»', 'Oui.']);
    assert.deepEqual(splitMessage('「行こう。」 うん。', one), ['「行こう。」', 'うん。']);
    assert.deepEqual(splitMessage("He said 'Wait. Please.' Fine.", one), ["He said 'Wait. Please.'", 'Fine.']);
});

test('apostrophes inside words are not quotes', () => {
    assert.deepEqual(splitMessage("It's late. Don't go.", one), ["It's late.", "Don't go."]);
});

test('emphasis spans stay whole; an end before the closing mark splits after it', () => {
    assert.deepEqual(splitMessage('*She smiles. Then waves.* Hi there.', one), ['*She smiles. Then waves.*', 'Hi there.']);
    assert.deepEqual(splitMessage('*nods* Okay. **Bold move.** Sure.', one), ['*nods* Okay.', '**Bold move.**', 'Sure.']);
    assert.deepEqual(splitMessage('_She sighs._ Fine.', one), ['_She sighs._', 'Fine.']);
    assert.deepEqual(splitMessage('use snake_case_names. Ok.', one), ['use snake_case_names.', 'Ok.']);
});

test('inline code and code fences stay whole', () => {
    assert.deepEqual(splitMessage('Run `npm i. now` first. Done.', one), ['Run `npm i. now` first.', 'Done.']);
    const fenced = 'Look:\n\n```js\nconst a = 1. ; // no split. here\n```\n\nThat is it. Bye.';
    assert.deepEqual(splitMessage(fenced, one), ['Look:', '```js\nconst a = 1. ; // no split. here\n```', 'That is it.', 'Bye.']);
});

test('lists, tables, headings and blockquotes stay whole', () => {
    const text = 'Here. Items:\n\n- one. two.\n- three.\n\n| a | b |\n|---|---|\n| 1. | 2. |\n\n# Title. Here\n\n> quoted. text.\n\nEnd.';
    assert.deepEqual(splitMessage(text), ['Here. Items:', '- one. two.\n- three.', '| a | b |\n|---|---|\n| 1. | 2. |', '# Title. Here', '> quoted. text.', 'End.']);
});

test('paragraphs always start a new part', () => {
    assert.deepEqual(splitMessage('A.\n\nB.'), ['A.', 'B.']);
    assert.deepEqual(splitMessage('A.\n\nB.', { paragraphs: false }), ['A.\n\nB.']);
});

test('pieces without letters join the one before; nothing empty', () => {
    assert.deepEqual(splitMessage('Wait. … Okay.', one), ['Wait. …', 'Okay.']);
    for (const part of splitMessage('Oh. Hm. Ah! ?! Fine.', one)) {
        assert.match(part, /\p{L}/u);
    }
});

test('a short sentence may stand alone', () => {
    assert.deepEqual(splitMessage('Oh. That makes sense now.', one), ['Oh.', 'That makes sense now.']);
});

test('maxLength stops grouping but never cuts a sentence', () => {
    const long = 'This is a fairly long sentence that goes on for a while.';
    assert.deepEqual(splitMessage(`${long} ${long}`, { maxSentences: 5, maxLength: 60 }), [long, long]);
});

test('every part keeps its markdown balanced', () => {
    const text = '*He grins.* "Got it. Let\'s go!" She nods. **Fine.** `x.y` works. Done!';
    for (const part of splitMessage(text, one)) {
        assert.equal((part.match(/\*\*/g) ?? []).length % 2, 0, part);
        assert.equal((part.replace(/\*\*/g, '').match(/\*/g) ?? []).length % 2, 0, part);
        assert.equal((part.match(/"/g) ?? []).length % 2, 0, part);
        assert.equal((part.match(/`/g) ?? []).length % 2, 0, part);
    }
});

test('the joined parts keep every word, in order', () => {
    const text = 'Mr. Kim said "Hi. Bye." *waves* Then: 3.5 apples! Really?! Yes… sure. 好。行！';
    const words = s => s.replace(/\s+/g, '');
    assert.equal(words(splitMessage(text, one).join(' ')), words(text));
});
