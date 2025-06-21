/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { CompositeSyntaxNode } from "../../../../src/syntax/abstracts/composite-syntax-node.js";
import { SyntaxNode } from "../../../../src/syntax/abstracts/syntax-node.js";
import { TriviaSyntaxNode } from "../../../../src/syntax/common/trivia-syntax-node.js";
import { HtmlTagSyntaxNode } from "../../../../src/syntax/html/tags/html-tag-syntax-node.js";

class TestNode extends SyntaxNode { }

test("HtmlTagSyntaxNode: constructs with children and no trivia", (context: TestContext) => {
    const children = [new TestNode(), new TestNode()];
    const node = new HtmlTagSyntaxNode(children);

    context.assert.deepStrictEqual(node.children, children);
    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("HtmlTagSyntaxNode: constructs with leading trivia only", (context: TestContext) => {
    const leading = new TriviaSyntaxNode(" ", null!);
    const node = new HtmlTagSyntaxNode([new TestNode()], leading);

    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("HtmlTagSyntaxNode: constructs with trailing trivia only", (context: TestContext) => {
    const trailing = new TriviaSyntaxNode("\n", null!);
    const node = new HtmlTagSyntaxNode([new TestNode()], null, trailing);

    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("HtmlTagSyntaxNode: constructs with both leading and trailing trivia", (context: TestContext) => {
    const leading = new TriviaSyntaxNode("\t", null!);
    const trailing = new TriviaSyntaxNode(" ", null!);
    const node = new HtmlTagSyntaxNode([new TestNode()], leading, trailing);

    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("HtmlTagSyntaxNode: can be subclassed with extra properties", (context: TestContext) => {
    class ExtendedHtmlTagSyntaxNode extends HtmlTagSyntaxNode { public extra = "x"; }
    const node = new ExtendedHtmlTagSyntaxNode([new TestNode()]);
    
    context.assert.strictEqual(node.extra, "x");
    context.assert.ok(node instanceof HtmlTagSyntaxNode);
    context.assert.ok(node instanceof CompositeSyntaxNode);
    context.assert.ok(node instanceof SyntaxNode);
});

test("HtmlTagSyntaxNode: children array is the same instance", (context: TestContext) => {
    const children = [new TestNode(), new TestNode()];
    const node = new HtmlTagSyntaxNode(children);

    context.assert.strictEqual(node.children, children);
});