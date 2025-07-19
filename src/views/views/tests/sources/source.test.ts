/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { Source } from "../../src/sources/source.js";

test("Source: constructor initializes content and lines", (context: TestContext) => {
    const content = "Line 1\nLine 2\nLine 3";
    const source = new Source(content);

    context.assert.strictEqual(source.content, content);
    context.assert.strictEqual(source.lines.length, 3);
    context.assert.strictEqual(source.lines[0].index, 0);
    context.assert.strictEqual(source.lines[1].index, 1);
    context.assert.strictEqual(source.lines[2].index, 2);
});

test("Source: getLocation throws exception for out-of-bounds endIndex", (context: TestContext) => {
    const content = "Line 1\nLine 2\nLine 3";
    const source = new Source(content);

    context.assert.throws(() => { source.getLocation(0, 100); }, { message: "endIndex is out of bounds" });
});

test("Source: getLocation throws exception for out-of-bounds startIndex", (context: TestContext) => {
    const content = "Line 1\nLine 2\nLine 3";
    const source = new Source(content);

    context.assert.throws(() => { source.getLocation(-1, 5); }, /out of bounds|Line not found/);
});

test("Source: getLocation spanning the entire content includes all text", (context: TestContext) => {
    const content = "Line 1\nLine 2\nLine 3";
    const source = new Source(content);
    const location = source.getLocation(0, content.length);

    context.assert.strictEqual(location.text, content);
});

test("Source: getLocation for a single character (first char)", (context: TestContext) => {
    const content = "hello";
    const source = new Source(content);
    const location = source.getLocation(0, 1);

    context.assert.strictEqual(location.text, "h");
});

test("Source: getLocation for a single character (middle char)", (context: TestContext) => {
    const content = "hello";
    const source = new Source(content);
    const location = source.getLocation(2, 3);

    context.assert.strictEqual(location.text, "l");
});

test("Source: getLocation for a single character (last char)", (context: TestContext) => {
    const content = "hello";
    const source = new Source(content);
    const location = source.getLocation(content.length - 1, content.length);

    context.assert.strictEqual(location.text, "o");
});

test("Source: getLocation for multi-line range, text matches substring", (context: TestContext) => {
    const content = "abc\ndef\nghi";
    const source = new Source(content);
    const start = 2;
    const end = 7;
    const expected = content.slice(start, end);
    const location = source.getLocation(start, end);

    context.assert.strictEqual(location.text, expected);
});

test("Source: getLocation with zero-width range (start==end)", (context: TestContext) => {
    const content = "abc\ndef";
    const source = new Source(content);
    const location = source.getLocation(4, 4);

    context.assert.strictEqual(location.text, "");
});

test("Source: getLocation for range that ends exactly at file end", (context: TestContext) => {
    const content = "abc\ndef";
    const source = new Source(content);
    const location = source.getLocation(2, content.length);

    context.assert.strictEqual(location.text, content.slice(2));
});

test("Source: getLocation for full line including newline", (context: TestContext) => {
    const content = "abc\ndef\nghi";
    const source = new Source(content);
    const start = 4;
    const end = 8;

    context.assert.strictEqual(source.getLocation(start, end).text, "def\n");
});

test("Source: getLocation for range with only newlines", (context: TestContext) => {
    const content = "\n\n";
    const source = new Source(content);
    const location = source.getLocation(0, 2);

    context.assert.strictEqual(location.text, "\n\n");
});

test("Source: getLocation handles mixed newline styles, text matches", (context: TestContext) => {
    const content = "foo\r\nbar\nbaz\rqux";
    const source = new Source(content);
    const start = 3;
    const end = 9;
    const expected = content.slice(start, end);
    const location = source.getLocation(start, end);

    context.assert.strictEqual(location.text, expected);
});

test("Source: getLocation for Unicode/multibyte characters", (context: TestContext) => {
    const content = "😀abc\n🍕def";
    const source = new Source(content);

    context.assert.strictEqual(source.getLocation(0, 2).text, "😀");
    context.assert.strictEqual(source.getLocation(6, 8).text, "🍕");
    context.assert.strictEqual(source.getLocation(2, 5).text, "abc");
    context.assert.strictEqual(source.getLocation(8, 11).text, "def");
    context.assert.strictEqual(source.getLocation(5, 6).text, "\n");
});

test("Source: getLocation for empty content yields empty text", (context: TestContext) => {
    const content = "";
    const source = new Source(content);
    const location = source.getLocation(0, 0);

    context.assert.strictEqual(location.text, "");
});

test("Source: getLocation for multi-line location (explicit properties + text)", (context: TestContext) => {
    const content = "Line 1\nLine 2\nLine 3";
    const source = new Source(content);
    const location = source.getLocation(5, 10);

    context.assert.strictEqual(location.startLineIndex, 0);
    context.assert.strictEqual(location.startCharacterIndex, 5);
    context.assert.strictEqual(location.endLineIndex, 1);
    context.assert.strictEqual(location.endCharacterIndex, 3);
    context.assert.strictEqual(location.text, content.slice(5, 10));
});

test("Source: getLocation for valid location within a line (explicit properties + text)", (context: TestContext) => {
    const content = "Line 1\nLine 2\nLine 3";
    const source = new Source(content);
    const location = source.getLocation(3, 7);

    context.assert.strictEqual(location.startLineIndex, 0);
    context.assert.strictEqual(location.startCharacterIndex, 3);
    context.assert.strictEqual(location.endLineIndex, 1);
    context.assert.strictEqual(location.endCharacterIndex, 0);
    context.assert.strictEqual(location.text, content.slice(3, 7));
});

test("Source: getLocation handles zero-width range at start", (context: TestContext) => {
    const content = "abc\ndef";
    const source = new Source(content);
    const location = source.getLocation(0, 0);

    context.assert.strictEqual(location.startLineIndex, 0);
    context.assert.strictEqual(location.startCharacterIndex, 0);
    context.assert.strictEqual(location.endLineIndex, 0);
    context.assert.strictEqual(location.endCharacterIndex, 0);
    context.assert.strictEqual(location.text, "");
});

test("Source: getLocation handles zero-width range at end", (context: TestContext) => {
    const content = "abc\ndef";
    const source = new Source(content);
    const location = source.getLocation(content.length, content.length);

    context.assert.strictEqual(location.startLineIndex, 1);
    context.assert.strictEqual(location.startCharacterIndex, 3);
    context.assert.strictEqual(location.endLineIndex, 1);
    context.assert.strictEqual(location.endCharacterIndex, 3);
    context.assert.strictEqual(location.text, "");
});

test("Source: getLocation for a line that's only a newline", (context: TestContext) => {
    const content = "\n";
    const source = new Source(content);

    context.assert.strictEqual(source.lines.length, 2);
    context.assert.strictEqual(source.lines[0].startCharacterIndex, 0);
    context.assert.strictEqual(source.lines[0].endCharacterIndex, 1);
    context.assert.strictEqual(source.lines[1].startCharacterIndex, 1);
    context.assert.strictEqual(source.lines[1].endCharacterIndex, 1);
    context.assert.strictEqual(source.getLocation(0, 1).text, "\n");
    context.assert.strictEqual(source.getLocation(1, 1).text, "");
});

test("Source: getLocation for location on last character of the last line", (context: TestContext) => {
    const content = "Line 1\nLine 2\nLine 3";
    const source = new Source(content);
    const location = source.getLocation(13, 15);

    context.assert.strictEqual(location.startLineIndex, 1);
    context.assert.strictEqual(location.startCharacterIndex, 6);
    context.assert.strictEqual(location.endLineIndex, 2);
    context.assert.strictEqual(location.endCharacterIndex, 1);
    context.assert.strictEqual(location.text, content.slice(13, 15));
});

test("Source: getLocation for valid location spanning multiple lines", (context: TestContext) => {
    const content = "Line 1\nLine 2\nLine 3";
    const source = new Source(content);
    const location = source.getLocation(3, 13);

    context.assert.strictEqual(location.startLineIndex, 0);
    context.assert.strictEqual(location.startCharacterIndex, 3);
    context.assert.strictEqual(location.endLineIndex, 1);
    context.assert.strictEqual(location.endCharacterIndex, 6);
    context.assert.strictEqual(location.text, content.slice(3, 13));
});

test("Source: handles empty string (no lines)", (context: TestContext) => {
    const content = "";
    const source = new Source(content);

    context.assert.strictEqual(source.lines.length, 0);
});

test("Source: handles single line without newline", (context: TestContext) => {
    const content = "hello";
    const source = new Source(content);

    context.assert.strictEqual(source.lines.length, 1);
    context.assert.strictEqual(source.lines[0].startCharacterIndex, 0);
    context.assert.strictEqual(source.lines[0].endCharacterIndex, 5);
    context.assert.strictEqual(content.slice(source.lines[0].startCharacterIndex, source.lines[0].endCharacterIndex), "hello");
});

test("Source: handles single line with newline", (context: TestContext) => {
    const content = "hello\n";
    const source = new Source(content);

    context.assert.strictEqual(source.lines.length, 2);
    context.assert.strictEqual(source.lines[0].startCharacterIndex, 0);
    context.assert.strictEqual(source.lines[0].endCharacterIndex, 6);
    context.assert.strictEqual(source.lines[1].startCharacterIndex, 6);
    context.assert.strictEqual(source.lines[1].endCharacterIndex, 6);
});

test("Source: handles only newline character", (context: TestContext) => {
    const content = "\n";
    const source = new Source(content);

    context.assert.strictEqual(source.lines.length, 2);
    context.assert.strictEqual(source.lines[0].startCharacterIndex, 0);
    context.assert.strictEqual(source.lines[0].endCharacterIndex, 1);
    context.assert.strictEqual(source.lines[1].startCharacterIndex, 1);
    context.assert.strictEqual(source.lines[1].endCharacterIndex, 1);
});

test("Source: handles only carriage return character", (context: TestContext) => {
    const content = "\r";
    const source = new Source(content);

    context.assert.strictEqual(source.lines.length, 2);
    context.assert.strictEqual(source.lines[0].startCharacterIndex, 0);
    context.assert.strictEqual(source.lines[0].endCharacterIndex, 1);
    context.assert.strictEqual(source.lines[1].startCharacterIndex, 1);
    context.assert.strictEqual(source.lines[1].endCharacterIndex, 1);
});

test("Source: handles trailing newline with multiple lines", (context: TestContext) => {
    const content = "foo\nbar\n";
    const source = new Source(content);

    context.assert.strictEqual(source.lines.length, 3);
    context.assert.strictEqual(source.lines[0].startCharacterIndex, 0);
    context.assert.strictEqual(source.lines[0].endCharacterIndex, 4);
    context.assert.strictEqual(source.lines[1].startCharacterIndex, 4);
    context.assert.strictEqual(source.lines[1].endCharacterIndex, 8);
    context.assert.strictEqual(source.lines[2].startCharacterIndex, 8);
    context.assert.strictEqual(source.lines[2].endCharacterIndex, 8);
});

test("Source: all line slices correspond to content substring", (context: TestContext) => {
    const content = "x\r\ny\nz\r";
    const source = new Source(content);

    source.lines.forEach(line => {
        context.assert.strictEqual(
            content.slice(line.startCharacterIndex, line.endCharacterIndex).length,
            line.endCharacterIndex - line.startCharacterIndex
        );
    });
});

test("Source: handles CRLF newline", (context: TestContext) => {
    const content = "a\r\nb";
    const source = new Source(content);

    context.assert.strictEqual(source.lines.length, 2);
    context.assert.strictEqual(source.lines[0].startCharacterIndex, 0);
    context.assert.strictEqual(source.lines[0].endCharacterIndex, 3);
    context.assert.strictEqual(source.lines[1].startCharacterIndex, 3);
    context.assert.strictEqual(source.lines[1].endCharacterIndex, 4);
});

test("Source: handles mixture of all newline types", (context: TestContext) => {
    const content = "A\r\nB\nC\rD";
    const source = new Source(content);

    context.assert.strictEqual(source.lines.length, 4);
    context.assert.strictEqual(source.lines[0].startCharacterIndex, 0);
    context.assert.strictEqual(source.lines[0].endCharacterIndex, 3);
    context.assert.strictEqual(source.lines[1].startCharacterIndex, 3);
    context.assert.strictEqual(source.lines[1].endCharacterIndex, 5);
    context.assert.strictEqual(source.lines[2].startCharacterIndex, 5);
    context.assert.strictEqual(source.lines[2].endCharacterIndex, 7);
    context.assert.strictEqual(source.lines[3].startCharacterIndex, 7);
    context.assert.strictEqual(source.lines[3].endCharacterIndex, 8);
});