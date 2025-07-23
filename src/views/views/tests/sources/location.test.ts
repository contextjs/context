/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { LineInfo } from "../../src/sources/line-info.js";
import { Location } from "../../src/sources/location.js";

test("Location: constructor sets all fields", (context: TestContext) => {
    const lines = [new LineInfo(0, 0, 6, "test"), new LineInfo(1, 7, 13, "test2")];
    const location = new Location(0, 2, 1, 4, 0, 0, "test", lines);

    context.assert.strictEqual(location.startLineIndex, 0);
    context.assert.strictEqual(location.startCharacterIndex, 2);
    context.assert.strictEqual(location.endLineIndex, 1);
    context.assert.strictEqual(location.endCharacterIndex, 4);
    context.assert.strictEqual(location.text, "test");
    context.assert.deepStrictEqual(location.lines, lines);
});

test("Location: toString returns correct format for point location", (context: TestContext) => {
    const location = new Location(3, 7, 3, 7, 0, 0, "x", []);

    context.assert.strictEqual(location.toString(), "Line 4, Column 8");
});

test("Location: toString returns correct format for single-line span", (context: TestContext) => {
    const location = new Location(2, 5, 2, 8, 0, 0, "abc", []);

    context.assert.strictEqual(location.toString(), "Line 3, Columns 6-9");
});

test("Location: toString returns correct format for multi-line span", (context: TestContext) => {
    const location = new Location(1, 0, 3, 4, 0, 0, "multi", []);

    context.assert.strictEqual(location.toString(), "Line 2, Column 1 - Line 4, Column 5");
});

test("Location: toString for first character of the first line", (context: TestContext) => {
    const location = new Location(0, 0, 0, 0, 0, 0, "start", []);

    context.assert.strictEqual(location.toString(), "Line 1, Column 1");
});

test("Location: toString for last character of the last line", (context: TestContext) => {
    const lines = [new LineInfo(0, 0, 6, "test"), new LineInfo(1, 7, 13, "test2")];
    const location = new Location(1, 4, 1, 4, 0, 0, "end", lines);

    context.assert.strictEqual(location.toString(), "Line 2, Column 5");
});

test("Location: toString for zero-length span", (context: TestContext) => {
    const location = new Location(1, 5, 1, 5, 0, 0, "zero", []);

    context.assert.strictEqual(location.toString(), "Line 2, Column 6");
});

test("Location: toString for same start and end indices", (context: TestContext) => {
    const location = new Location(2, 3, 2, 3, 0, 0, "same", []);

    context.assert.strictEqual(location.toString(), "Line 3, Column 4");
});