/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Location } from "@contextjs/views";
import test, { TestContext } from "node:test";
import { LocationSyntaxNode } from "../../../../src/syntax/abstracts/location-syntax-node.js";
import { SyntaxNode } from "../../../../src/syntax/abstracts/syntax-node.js";
import { ValueSyntaxNode } from "../../../../src/syntax/abstracts/value-syntax-node.js";
import { TriviaSyntaxNode } from "../../../../src/syntax/common/trivia-syntax-node.js";
import { StyleContentSyntaxNode } from "../../../../src/syntax/html/style/style-content-syntax-node.js";

const testLocation = new Location(0, 0, 0, 10, "", []);

test("StyleContentSyntaxNode: constructs with value and location", (context: TestContext) => {
    const value = "body { color: red; }";
    const node = new StyleContentSyntaxNode(value, testLocation);

    context.assert.strictEqual(node.value, value);
    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, null);
    context.assert.deepStrictEqual(node.location, testLocation);
});

test("StyleContentSyntaxNode: supports leading trivia", (context: TestContext) => {
    const leading = new TriviaSyntaxNode("lead", null!);
    const node = new StyleContentSyntaxNode("x", testLocation, leading);

    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("StyleContentSyntaxNode: supports trailing trivia", (context: TestContext) => {
    const trailing = new TriviaSyntaxNode("trail", null!);
    const node = new StyleContentSyntaxNode("x", testLocation, null, trailing);

    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("StyleContentSyntaxNode: supports both leading and trailing trivia", (context: TestContext) => {
    const leading = new TriviaSyntaxNode("lead", null!);
    const trailing = new TriviaSyntaxNode("trail", null!);
    const node = new StyleContentSyntaxNode("x", testLocation, leading, trailing);

    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("StyleContentSyntaxNode: supports subclassing", (context: TestContext) => {
    class Extended extends StyleContentSyntaxNode { public meta = 123; }
    const node = new Extended("a", testLocation);

    context.assert.strictEqual(node.meta, 123);
    context.assert.ok(node instanceof StyleContentSyntaxNode);
    context.assert.ok(node instanceof ValueSyntaxNode);
    context.assert.ok(node instanceof LocationSyntaxNode);
    context.assert.ok(node instanceof SyntaxNode);
});