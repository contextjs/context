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
import { StyleTagStartSyntaxNode } from "../../../../src/syntax/html/style/style-tag-start-syntax-node.js";

class TestNode extends SyntaxNode { }

test("StyleTagStartSyntaxNode: constructs with children and no trivia", (context: TestContext) => {
    const children = [new TestNode(), new TestNode()];
    const node = new StyleTagStartSyntaxNode(children);

    context.assert.deepStrictEqual(node.children, children);
    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("StyleTagStartSyntaxNode: constructs with leading trivia", (context: TestContext) => {
    const trivia = new TriviaSyntaxNode("leading", null!);
    const node = new StyleTagStartSyntaxNode([new TestNode()], trivia);

    context.assert.strictEqual(node.leadingTrivia, trivia);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("StyleTagStartSyntaxNode: constructs with trailing trivia", (context: TestContext) => {
    const trivia = new TriviaSyntaxNode("trailing", null!);
    const node = new StyleTagStartSyntaxNode([new TestNode()], null, trivia);

    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, trivia);
});

test("StyleTagStartSyntaxNode: constructs with both trivia", (context: TestContext) => {
    const leading = new TriviaSyntaxNode("l", null!);
    const trailing = new TriviaSyntaxNode("t", null!);
    const node = new StyleTagStartSyntaxNode([new TestNode()], leading, trailing);

    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("StyleTagStartSyntaxNode: retains reference to original children array", (context: TestContext) => {
    const children = [new TestNode(), new TestNode()];
    const node = new StyleTagStartSyntaxNode(children);

    context.assert.strictEqual(node.children, children);
});

test("StyleTagStartSyntaxNode: can be subclassed with additional properties", (context: TestContext) => {
    class Extended extends StyleTagStartSyntaxNode { public meta = 123; }
    const node = new Extended([new TestNode()]);

    context.assert.strictEqual(node.meta, 123);
    context.assert.ok(node instanceof StyleTagStartSyntaxNode);
    context.assert.ok(node instanceof SyntaxNode);
});