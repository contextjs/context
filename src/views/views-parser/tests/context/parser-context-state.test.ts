/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { ParserContextState } from "../../src/context/parser-context-state.js";

test("ParserContextState: enum values are correct", (context: TestContext) => {
    context.assert.strictEqual(ParserContextState.RootBlock, "RootBlock");
    context.assert.strictEqual(ParserContextState.NestedBlock, "NestedBlock");
});

test("ParserContextState: enum supports type-safe assignments", (context: TestContext) => {
    let state: ParserContextState = ParserContextState.NestedBlock;
    context.assert.strictEqual(state, "NestedBlock");

    state = ParserContextState.RootBlock;
    context.assert.strictEqual(state, "RootBlock");
});