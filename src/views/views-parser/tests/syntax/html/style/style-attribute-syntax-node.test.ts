/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { SyntaxNode } from "../../../../src/syntax/abstracts/syntax-node.js";
import { TriviaSyntaxNode } from "../../../../src/syntax/common/trivia-syntax-node.js";
import { StyleAttributeSyntaxNode } from "../../../../src/syntax/html/style/style-attribute-syntax-node.js";

class TestNode extends SyntaxNode { }

test("StyleAttributeSyntaxNode: constructs with children, trivia defaults to null", (context: TestContext) => {
    const child1 = new TestNode();
    const child2 = new TestNode();
    const node = new StyleAttributeSyntaxNode([child1, child2]);

    context.assert.deepStrictEqual(node.children, [child1, child2]);
    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("StyleAttributeSyntaxNode: constructs with empty children", (context: TestContext) => {
    const node = new StyleAttributeSyntaxNode([]);

    context.assert.deepStrictEqual(node.children, []);
    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("StyleAttributeSyntaxNode: supports leading trivia", (context: TestContext) => {
    const leading = new TriviaSyntaxNode("lead", null!);
    const node = new StyleAttributeSyntaxNode([new TestNode()], leading);

    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("StyleAttributeSyntaxNode: supports trailing trivia", (context: TestContext) => {
    const trailing = new TriviaSyntaxNode("trail", null!);
    const node = new StyleAttributeSyntaxNode([new TestNode()], null, trailing);

    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("StyleAttributeSyntaxNode: supports both leading and trailing trivia", (context: TestContext) => {
    const leading = new TriviaSyntaxNode("lead", null!);
    const trailing = new TriviaSyntaxNode("trail", null!);
    const node = new StyleAttributeSyntaxNode([new TestNode()], leading, trailing);

    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("StyleAttributeSyntaxNode: can be subclassed with extra properties", (context: TestContext) => {
    class ExtendedAttribute extends StyleAttributeSyntaxNode { public extra = 42; }
    const node = new ExtendedAttribute([new TestNode()]);

    context.assert.strictEqual(node.extra, 42);
    context.assert.ok(node instanceof StyleAttributeSyntaxNode);
    context.assert.ok(node instanceof SyntaxNode);
});

test("StyleAttributeSyntaxNode: children array is the same instance", (context: TestContext) => {
    const nodes = [new TestNode(), new TestNode()];
    const node = new StyleAttributeSyntaxNode(nodes);

    context.assert.strictEqual(node.children, nodes);
});