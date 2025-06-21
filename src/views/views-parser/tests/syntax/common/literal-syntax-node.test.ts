/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { Location } from "../../../src/sources/location.js";
import { LiteralSyntaxNode } from "../../../src/syntax/common/literal-syntax-node.js";
import { TriviaSyntaxNode } from "../../../src/syntax/common/trivia-syntax-node.js";

function createLocation(): Location {
    return new Location(0, 0, 0, 3, "abc", []);
}

test("LiteralSyntaxNode: inherits from ValueSyntaxNode and stores value/location", (context: TestContext) => {
    const location = createLocation();
    const node = new LiteralSyntaxNode("abc", location);

    context.assert.strictEqual(node.value, "abc");
    context.assert.strictEqual(node.location, location);
    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("LiteralSyntaxNode: allows null value", (context: TestContext) => {
    const location = createLocation();
    const node = new LiteralSyntaxNode(null, location);

    context.assert.strictEqual(node.value, null);
    context.assert.strictEqual(node.location, location);
});

test("LiteralSyntaxNode: sets leading trivia when provided", (context: TestContext) => {
    const location = createLocation();
    const leading = new TriviaSyntaxNode("lead", location);
    const node = new LiteralSyntaxNode("abc", location, leading);

    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("LiteralSyntaxNode: sets trailing trivia when provided", (context: TestContext) => {
    const location = createLocation();
    const trailing = new TriviaSyntaxNode("trail", location);
    const node = new LiteralSyntaxNode("abc", location, null, trailing);

    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("LiteralSyntaxNode: sets both leading and trailing trivia when provided", (context: TestContext) => {
    const location = createLocation();
    const leading = new TriviaSyntaxNode("lead", location);
    const trailing = new TriviaSyntaxNode("trail", location);
    const node = new LiteralSyntaxNode("abc", location, leading, trailing);

    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("LiteralSyntaxNode: allows empty string value", (context: TestContext) => {
    const location = createLocation();
    const node = new LiteralSyntaxNode("", location);

    context.assert.strictEqual(node.value, "");
});

test("LiteralSyntaxNode: is extensible via subclass", (context: TestContext) => {
    class ExtendedLiteral extends LiteralSyntaxNode { public extra = 42; }
    const node = new ExtendedLiteral("abc", createLocation());

    context.assert.strictEqual(node.extra, 42);
});