/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Location } from "@contextjs/views";
import test, { TestContext } from "node:test";
import { QuoteSyntaxNode } from "../../../src/syntax/common/quote-syntax-node.js";
import { TriviaSyntaxNode } from "../../../src/syntax/common/trivia-syntax-node.js";

function createLocation(): Location {
    return new Location(1, 2, 3, 4, "foo", []);
}

test("QuoteSyntaxNode: stores value and location, trivia defaults to null", (context: TestContext) => {
    const location = createLocation();
    const node = new QuoteSyntaxNode("{", location);

    context.assert.strictEqual(node.value, "{");
    context.assert.strictEqual(node.location, location);
    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("QuoteSyntaxNode: accepts null value", (context: TestContext) => {
    const location = createLocation();
    const node = new QuoteSyntaxNode(null, location);

    context.assert.strictEqual(node.value, null);
    context.assert.strictEqual(node.location, location);
});

test("QuoteSyntaxNode: stores leading trivia when provided", (context: TestContext) => {
    const location = createLocation();
    const leading = new TriviaSyntaxNode("lead", location);
    const node = new QuoteSyntaxNode("\"", location, leading);

    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("QuoteSyntaxNode: stores trailing trivia when provided", (context: TestContext) => {
    const location = createLocation();
    const trailing = new TriviaSyntaxNode("trail", location);
    const node = new QuoteSyntaxNode("'", location, null, trailing);

    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("QuoteSyntaxNode: stores both leading and trailing trivia when provided", (context: TestContext) => {
    const location = createLocation();
    const leading = new TriviaSyntaxNode("lead", location);
    const trailing = new TriviaSyntaxNode("trail", location);
    const node = new QuoteSyntaxNode("`", location, leading, trailing);

    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});