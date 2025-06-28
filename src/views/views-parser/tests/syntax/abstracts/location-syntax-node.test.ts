/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Location } from "@contextjs/views";
import test, { TestContext } from "node:test";
import { LocationSyntaxNode } from "../../../src/syntax/abstracts/location-syntax-node.js";
import { TriviaSyntaxNode } from "../../../src/syntax/common/trivia-syntax-node.js";

class TestLocationSyntaxNode extends LocationSyntaxNode { }

function createLocation(): Location {
    return new Location(1, 2, 3, 4, "foo", []);
}

test("LocationSyntaxNode: stores location and defaults trivia to null", (context: TestContext) => {
    const location = createLocation();
    const node = new TestLocationSyntaxNode(location);

    context.assert.strictEqual(node.location, location);
    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("LocationSyntaxNode: stores leading trivia when provided", (context: TestContext) => {
    const location = createLocation();
    const leading = new TriviaSyntaxNode("leading", createLocation());
    const node = new TestLocationSyntaxNode(location, leading);

    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("LocationSyntaxNode: stores trailing trivia when provided", (context: TestContext) => {
    const location = createLocation();
    const trailing = new TriviaSyntaxNode("trailing", createLocation());
    const node = new TestLocationSyntaxNode(location, null, trailing);

    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("LocationSyntaxNode: stores both leading and trailing trivia when provided", (context: TestContext) => {
    const location = createLocation();
    const leading = new TriviaSyntaxNode("leading", createLocation());
    const trailing = new TriviaSyntaxNode("trailing", createLocation());
    const node = new TestLocationSyntaxNode(location, leading, trailing);

    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});