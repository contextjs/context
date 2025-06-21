/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { Location } from "../../../src/sources/location.js";
import { DelimiterSyntaxNode } from "../../../src/syntax/abstracts/delimiter-syntax-node.js";
import { TriviaSyntaxNode } from "../../../src/syntax/common/trivia-syntax-node.js";

class TestDelimiterSyntaxNode extends DelimiterSyntaxNode { }

function createLocation(): Location {
    return new Location(1, 2, 3, 4, "foo", []);
}

test("DelimiterSyntaxNode: stores delimiter and location, trivia defaults to null", (context: TestContext) => {
    const location = createLocation();
    const node = new TestDelimiterSyntaxNode("bar", location);

    context.assert.strictEqual(node.value, "bar");
    context.assert.strictEqual(node.location, location);
    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("DelimiterSyntaxNode: accepts null delimiter", (context: TestContext) => {
    const location = createLocation();
    const node = new TestDelimiterSyntaxNode(null, location);

    context.assert.strictEqual(node.value, null);
    context.assert.strictEqual(node.location, location);
});

test("DelimiterSyntaxNode: stores leading trivia when provided", (context: TestContext) => {
    const location = createLocation();
    const leading = new TriviaSyntaxNode("trivia", location);
    const node = new TestDelimiterSyntaxNode("bar", location, leading);

    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("DelimiterSyntaxNode: stores both leading and trailing trivia when provided", (context: TestContext) => {
    const location = createLocation();
    const leading = new TriviaSyntaxNode("lead", location);
    const trailing = new TriviaSyntaxNode("trail", location);
    const node = new TestDelimiterSyntaxNode("bar", location, leading, trailing);

    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("DelimiterSyntaxNode: stores trailing trivia when only trailing provided", (context: TestContext) => {
    const location = createLocation();
    const trailing = new TriviaSyntaxNode("trail", location);
    const node = new TestDelimiterSyntaxNode("bar", location, null, trailing);

    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});