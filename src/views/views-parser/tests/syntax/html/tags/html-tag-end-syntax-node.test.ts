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
import { HtmlTagEndSyntaxNode } from "../../../../src/syntax/html/tags/html-tag-end-syntax-node.js";

class TestNode extends SyntaxNode { }

test("HtmlTagEndSyntaxNode: constructs with children and no trivia", (context: TestContext) => {
    const children = [new TestNode(), new TestNode()];
    const node = new HtmlTagEndSyntaxNode(children);

    context.assert.deepStrictEqual(node.children, children);
    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("HtmlTagEndSyntaxNode: constructs with leading trivia", (context: TestContext) => {
    const leading = new TriviaSyntaxNode(" ", null!);
    const node = new HtmlTagEndSyntaxNode([new TestNode()], leading);

    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("HtmlTagEndSyntaxNode: constructs with trailing trivia", (context: TestContext) => {
    const trailing = new TriviaSyntaxNode("\t", null!);
    const node = new HtmlTagEndSyntaxNode([new TestNode()], null, trailing);

    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("HtmlTagEndSyntaxNode: constructs with both trivia", (context: TestContext) => {
    const leading = new TriviaSyntaxNode(" ", null!);
    const trailing = new TriviaSyntaxNode("\n", null!);
    const node = new HtmlTagEndSyntaxNode([new TestNode()], leading, trailing);

    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("HtmlTagEndSyntaxNode: children array is the same instance", (context: TestContext) => {
    const nodes = [new TestNode(), new TestNode()];
    const node = new HtmlTagEndSyntaxNode(nodes);

    context.assert.strictEqual(node.children, nodes);
});

test("HtmlTagEndSyntaxNode: can be subclassed with extra properties", (context: TestContext) => {
    class Extended extends HtmlTagEndSyntaxNode { public extra = "abc"; }
    const node = new Extended([new TestNode()]);

    context.assert.strictEqual(node.extra, "abc");
    context.assert.ok(node instanceof HtmlTagEndSyntaxNode);
    context.assert.ok(node instanceof SyntaxNode);
});