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

    context.assert.throws(() => { source.getLocation(0, 100, "Invalid endIndex"); }, { message: "endIndex is out of bounds" });
});

test("Source: getLocation for location spanning the entire content", (context: TestContext) => {
    const content = "Line 1\nLine 2\nLine 3";
    const source = new Source(content);
    const location = source.getLocation(0, content.length - 1, "Entire content");

    context.assert.strictEqual(location.startLineIndex, 0);
    context.assert.strictEqual(location.startCharacterIndex, 0);
    context.assert.strictEqual(location.endLineIndex, 2);
    context.assert.strictEqual(location.endCharacterIndex, 5);
    context.assert.strictEqual(location.text, "Entire content");
});

test("Source: getLocation throws exception for out-of-bounds startIndex", (context: TestContext) => {
    const content = "Line 1\nLine 2\nLine 3";
    const source = new Source(content);

    context.assert.throws(() => { source.getLocation(-1, 5, "Invalid startIndex"); }, "Exception: Line not found for the given character index");
});

test("Source: getLocation for multi-line location", (context: TestContext) => {
    const content = "Line 1\nLine 2\nLine 3";
    const source = new Source(content);
    const location = source.getLocation(5, 10, "");

    context.assert.strictEqual(location.startLineIndex, 0);
    context.assert.strictEqual(location.startCharacterIndex, 5);
    context.assert.strictEqual(location.endLineIndex, 1);
    context.assert.strictEqual(location.endCharacterIndex, 3);
});

test("Source: getLocation for valid location within a line", (context: TestContext) => {
    const content = "Line 1\nLine 2\nLine 3";
    const source = new Source(content);
    const location = source.getLocation(3, 7, "");

    context.assert.strictEqual(location.startLineIndex, 0);
    context.assert.strictEqual(location.startCharacterIndex, 3);
    context.assert.strictEqual(location.endLineIndex, 1);
    context.assert.strictEqual(location.endCharacterIndex, 0);
});

test("Source: getLocation handles zero-width range at start", (context: TestContext) => {
    const content = "abc\ndef";
    const source = new Source(content);
    const location = source.getLocation(0, 0, "");

    context.assert.strictEqual(location.startLineIndex, 0);
    context.assert.strictEqual(location.startCharacterIndex, 0);
    context.assert.strictEqual(location.endLineIndex, 0);
    context.assert.strictEqual(location.endCharacterIndex, 0);
});

test("Source: getLocation handles zero-width range at end", (context: TestContext) => {
    const content = "abc\ndef";
    const source = new Source(content);
    const location = source.getLocation(content.length, content.length, "");

    context.assert.strictEqual(location.startLineIndex, 1);
    context.assert.strictEqual(location.startCharacterIndex, 3);
    context.assert.strictEqual(location.endLineIndex, 1);
    context.assert.strictEqual(location.endCharacterIndex, 3);
});

test("Source: getLocation handles mixed newline styles", (context: TestContext) => {
    const content = "foo\r\nbar\nbaz\rqux";
    const source = new Source(content);
    context.assert.strictEqual(source.lines.length, 4);

    const location = source.getLocation(0, content.length, "all");
    context.assert.strictEqual(location.startLineIndex, 0);
    context.assert.strictEqual(location.startCharacterIndex, 0);
    context.assert.strictEqual(location.endLineIndex, 3);
    context.assert.strictEqual(location.endCharacterIndex, 3);
});

test("Source: getLocation for range ending exactly at file end", (context: TestContext) => {
    const content = "abc\ndef";
    const source = new Source(content);

    const location = source.getLocation(2, content.length, "");
    context.assert.strictEqual(location.startLineIndex, 0);
    context.assert.strictEqual(location.startCharacterIndex, 2);
    context.assert.strictEqual(location.endLineIndex, 1);
    context.assert.strictEqual(location.endCharacterIndex, 3);
});

test("Source: getLocation for a line that's only a newline", (context: TestContext) => {
    const content = "\n";
    const source = new Source(content);

    context.assert.strictEqual(source.lines.length, 2);
    context.assert.strictEqual(source.lines[0].startCharacterIndex, 0);
    context.assert.strictEqual(source.lines[0].endCharacterIndex, 1);
    context.assert.strictEqual(source.lines[1].startCharacterIndex, 1);
    context.assert.strictEqual(source.lines[1].endCharacterIndex, 1);
});

test("Source: getLocation for location on last character of the last line", (context: TestContext) => {
    const content = "Line 1\nLine 2\nLine 3";
    const source = new Source(content);
    const location = source.getLocation(13, 15, "");

    context.assert.strictEqual(location.startLineIndex, 1);
    context.assert.strictEqual(location.startCharacterIndex, 6);
    context.assert.strictEqual(location.endLineIndex, 2);
    context.assert.strictEqual(location.endCharacterIndex, 1);
});

test("Source: getLocation for valid location spanning multiple lines", (context: TestContext) => {
    const content = "Line 1\nLine 2\nLine 3";
    const source = new Source(content);
    const location = source.getLocation(3, 13, "");

    context.assert.strictEqual(location.startLineIndex, 0);
    context.assert.strictEqual(location.startCharacterIndex, 3);
    context.assert.strictEqual(location.endLineIndex, 1);
    context.assert.strictEqual(location.endCharacterIndex, 6);
});

test("Source: getLocation with Unicode/multibyte characters", (context: TestContext) => {
    const content = "😀abc\n🍕def";
    const source = new Source(content);

    const location = source.getLocation(0, 1, "😀");
    context.assert.strictEqual(location.startLineIndex, 0);
    context.assert.strictEqual(location.startCharacterIndex, 0);
    context.assert.strictEqual(location.endLineIndex, 0);
    context.assert.strictEqual(location.endCharacterIndex, 1);

    const emoji2Location = source.getLocation(5, 6, "🍕");
    context.assert.strictEqual(emoji2Location.startLineIndex, 0);
    context.assert.strictEqual(emoji2Location.startCharacterIndex, 5);
    context.assert.strictEqual(emoji2Location.endLineIndex, 1);
    context.assert.strictEqual(emoji2Location.endCharacterIndex, 0);
});