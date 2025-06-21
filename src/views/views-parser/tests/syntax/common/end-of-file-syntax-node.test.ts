/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { Location } from "../../../src/sources/location.js";
import { LocationSyntaxNode } from "../../../src/syntax/abstracts/location-syntax-node.js";
import { EndOfFileSyntaxNode } from "../../../src/syntax/common/end-of-file-syntax-node.js";
import { TriviaSyntaxNode } from "../../../src/syntax/common/trivia-syntax-node.js";

function createLocation(): Location {
    return new Location(0, 0, 0, 0, "", []);
}

test("EndOfFileSyntaxNode: static endOfFile is EOF", (context: TestContext) => {
    context.assert.strictEqual(EndOfFileSyntaxNode.endOfFile, "\0");
});

test("EndOfFileSyntaxNode: stores location and defaults leadingTrivia to null", (context: TestContext) => {
    const location = createLocation();
    const node = new EndOfFileSyntaxNode(location);

    context.assert.strictEqual(node.location, location);
    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("EndOfFileSyntaxNode: stores leadingTrivia when provided", (context: TestContext) => {
    const location = createLocation();
    const leading = new TriviaSyntaxNode("lead", location);
    const node = new EndOfFileSyntaxNode(location, leading);

    context.assert.strictEqual(node.location, location);
    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("EndOfFileSyntaxNode: inherits from LocationSyntaxNode", (context: TestContext) => {
    const location = createLocation();
    const node = new EndOfFileSyntaxNode(location);

    context.assert.ok(node instanceof EndOfFileSyntaxNode);
    context.assert.ok(node instanceof LocationSyntaxNode);
});