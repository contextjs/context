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
import { StyleTagEndSyntaxNode } from "../../../../src/syntax/html/style/style-tag-end-syntax-node.js";

class TestNode extends SyntaxNode { }

test("StyleTagEndSyntaxNode: constructs with children and no trivia", (context: TestContext) => {
    const children = [new TestNode(), new TestNode()];
    const node = new StyleTagEndSyntaxNode(children);

    context.assert.deepStrictEqual(node.children, children);
    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("StyleTagEndSyntaxNode: constructs with leading trivia", (context: TestContext) => {
    const leading = new TriviaSyntaxNode("lead", null!);
    const node = new StyleTagEndSyntaxNode([new TestNode()], leading);

    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("StyleTagEndSyntaxNode: constructs with trailing trivia", (context: TestContext) => {
    const trailing = new TriviaSyntaxNode("trail", null!);
    const node = new StyleTagEndSyntaxNode([new TestNode()], null, trailing);

    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("StyleTagEndSyntaxNode: constructs with both trivia", (context: TestContext) => {
    const leading = new TriviaSyntaxNode("lead", null!);
    const trailing = new TriviaSyntaxNode("trail", null!);
    const node = new StyleTagEndSyntaxNode([new TestNode()], leading, trailing);

    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("StyleTagEndSyntaxNode: children reference is preserved", (context: TestContext) => {
    const children = [new TestNode()];
    const node = new StyleTagEndSyntaxNode(children);

    context.assert.strictEqual(node.children, children);
});

test("StyleTagEndSyntaxNode: supports subclassing", (context: TestContext) => {
    class Extended extends StyleTagEndSyntaxNode { public tagName = "style"; }
    const node = new Extended([new TestNode()]);

    context.assert.strictEqual(node.tagName, "style");
    context.assert.ok(node instanceof StyleTagEndSyntaxNode);
    context.assert.ok(node instanceof SyntaxNode);
});