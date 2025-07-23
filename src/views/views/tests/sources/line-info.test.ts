/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { LineInfo } from "../../src/sources/line-info.js";

test("LineInfo: constructor initializes properties correctly", (context: TestContext) => {
    const index = 1;
    const startCharacterIndex = 5;
    const endCharacterIndex = 10;
    const lineInfo = new LineInfo(index, startCharacterIndex, endCharacterIndex, "example line");

    context.assert.strictEqual(lineInfo.index, index);
    context.assert.strictEqual(lineInfo.startCharacterIndex, startCharacterIndex);
    context.assert.strictEqual(lineInfo.endCharacterIndex, endCharacterIndex);
    context.assert.strictEqual(lineInfo.text, "example line");
});

test("LineInfo: handles zero values", (context: TestContext) => {
    const lineInfo = new LineInfo(0, 0, 0, "");

    context.assert.strictEqual(lineInfo.index, 0);
    context.assert.strictEqual(lineInfo.startCharacterIndex, 0);
    context.assert.strictEqual(lineInfo.endCharacterIndex, 0);
    context.assert.strictEqual(lineInfo.text, "");
});

test("LineInfo: handles negative index", (context: TestContext) => {
    const lineInfo = new LineInfo(-1, 5, 10, "negative index");

    context.assert.strictEqual(lineInfo.index, -1);
    context.assert.strictEqual(lineInfo.startCharacterIndex, 5);
    context.assert.strictEqual(lineInfo.endCharacterIndex, 10);
    context.assert.strictEqual(lineInfo.text, "negative index");
});

test("LineInfo: handles negative startCharacterIndex", (context: TestContext) => {
    const lineInfo = new LineInfo(1, -5, 0, "negative start");

    context.assert.strictEqual(lineInfo.index, 1);
    context.assert.strictEqual(lineInfo.startCharacterIndex, -5);
    context.assert.strictEqual(lineInfo.endCharacterIndex, 0);
    context.assert.strictEqual(lineInfo.text, "negative start");
});