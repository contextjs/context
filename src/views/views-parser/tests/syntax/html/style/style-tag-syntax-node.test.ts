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
import { StyleTagSyntaxNode } from "../../../../src/syntax/html/style/style-tag-syntax-node.js";

class TestNode extends SyntaxNode { }

test("StyleTagSyntaxNode: constructs with children and no trivia", (context: TestContext) => {
    const children = [new TestNode(), new TestNode()];
    const node = new StyleTagSyntaxNode(children);

    context.assert.deepStrictEqual(node.children, children);
    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("StyleTagSyntaxNode: constructs with leading trivia", (context: TestContext) => {
    const trivia = new TriviaSyntaxNode("leading", null!);
    const node = new StyleTagSyntaxNode([new TestNode()], trivia);

    context.assert.strictEqual(node.leadingTrivia, trivia);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("StyleTagSyntaxNode: constructs with trailing trivia", (context: TestContext) => {
    const trivia = new TriviaSyntaxNode("trailing", null!);
    const node = new StyleTagSyntaxNode([new TestNode()], null, trivia);

    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, trivia);
});

test("StyleTagSyntaxNode: constructs with both trivia", (context: TestContext) => {
    const leading = new TriviaSyntaxNode("l", null!);
    const trailing = new TriviaSyntaxNode("t", null!);
    const node = new StyleTagSyntaxNode([new TestNode()], leading, trailing);

    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("StyleTagSyntaxNode: children array is the same instance", (context: TestContext) => {
    const nodes = [new TestNode(), new TestNode()];
    const node = new StyleTagSyntaxNode(nodes);

    context.assert.strictEqual(node.children, nodes);
});

test("StyleTagSyntaxNode: can be subclassed with extra properties", (context: TestContext) => {
    class Extended extends StyleTagSyntaxNode { public extra = 42; }
    const node = new Extended([new TestNode()]);

    context.assert.strictEqual(node.extra, 42);
    context.assert.ok(node instanceof StyleTagSyntaxNode);
    context.assert.ok(node instanceof SyntaxNode);
});