/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Location } from "@contextjs/views";
import test, { TestContext } from "node:test";
import { BracketSyntaxNode } from "../../../src/syntax/abstracts/bracket-syntax-node.js";
import { TriviaSyntaxNode } from "../../../src/syntax/common/trivia-syntax-node.js";

function createLocation(): Location {
    return new Location(1, 2, 3, 4, "foo", []);
}

class TestBracketSyntaxNode extends BracketSyntaxNode { }

test("BracketSyntaxNode: stores value and location, trivia defaults to null", (context: TestContext) => {
    const location = createLocation();
    const node = new TestBracketSyntaxNode("{", location);

    context.assert.strictEqual(node.value, "{");
    context.assert.strictEqual(node.location, location);
    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("BracketSyntaxNode: accepts null value", (context: TestContext) => {
    const location = createLocation();
    const node = new TestBracketSyntaxNode(null, location);

    context.assert.strictEqual(node.value, null);
    context.assert.strictEqual(node.location, location);
});

test("BracketSyntaxNode: stores leading trivia when provided", (context: TestContext) => {
    const location = createLocation();
    const leading = new TriviaSyntaxNode("lead", location);
    const node = new TestBracketSyntaxNode("}", location, leading);

    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("BracketSyntaxNode: stores trailing trivia when provided", (context: TestContext) => {
    const location = createLocation();
    const trailing = new TriviaSyntaxNode("trail", location);
    const node = new TestBracketSyntaxNode("{", location, null, trailing);

    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("BracketSyntaxNode: stores both leading and trailing trivia when provided", (context: TestContext) => {
    const location = createLocation();
    const leading = new TriviaSyntaxNode("lead", location);
    const trailing = new TriviaSyntaxNode("trail", location);
    const node = new TestBracketSyntaxNode("{", location, leading, trailing);

    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});