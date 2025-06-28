/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Location } from "@contextjs/views";
import test, { TestContext } from "node:test";
import { TriviaSyntaxNode } from "../../../src/syntax/common/trivia-syntax-node.js";

function createLocation(): Location {
    return new Location(0, 0, 0, 5, "     ", []);
}

test("TriviaSyntaxNode: inherits from ValueSyntaxNode and stores value/location", (context: TestContext) => {
    const location = createLocation();
    const node = new TriviaSyntaxNode("     ", location);

    context.assert.strictEqual(node.value, "     ");
    context.assert.strictEqual(node.location, location);
    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("TriviaSyntaxNode: allows null value", (context: TestContext) => {
    const location = createLocation();
    const node = new TriviaSyntaxNode(null, location);

    context.assert.strictEqual(node.value, null);
    context.assert.strictEqual(node.location, location);
});

test("TriviaSyntaxNode: supports tabs and newlines as value", (context: TestContext) => {
    const location = createLocation();
    const node = new TriviaSyntaxNode("\t\n  ", location);

    context.assert.strictEqual(node.value, "\t\n  ");
});

test("TriviaSyntaxNode: allows empty string as value", (context: TestContext) => {
    const location = createLocation();
    const node = new TriviaSyntaxNode("", location);

    context.assert.strictEqual(node.value, "");
});