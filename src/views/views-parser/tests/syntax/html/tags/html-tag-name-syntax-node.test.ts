/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { CompositeSyntaxNode } from "../../../../src/syntax/abstracts/composite-syntax-node.js";
import { NameSyntaxNode } from "../../../../src/syntax/abstracts/name-syntax-node.js";
import { SyntaxNode } from "../../../../src/syntax/abstracts/syntax-node.js";
import { TriviaSyntaxNode } from "../../../../src/syntax/common/trivia-syntax-node.js";
import { HtmlTagNameSyntaxNode } from "../../../../src/syntax/html/tags/html-tag-name-syntax-node.js";

class TestNode extends SyntaxNode { }

test("HtmlTagNameSyntaxNode: constructs with children and no trivia", (context: TestContext) => {
    const children = [new TestNode(), new TestNode()];
    const node = new HtmlTagNameSyntaxNode(children);

    context.assert.deepStrictEqual(node.children, children);
    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("HtmlTagNameSyntaxNode: constructs with leading trivia", (context: TestContext) => {
    const leading = new TriviaSyntaxNode(" ", null!);
    const node = new HtmlTagNameSyntaxNode([new TestNode()], leading);

    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("HtmlTagNameSyntaxNode: constructs with trailing trivia", (context: TestContext) => {
    const trailing = new TriviaSyntaxNode("  ", null!);
    const node = new HtmlTagNameSyntaxNode([new TestNode()], null, trailing);

    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("HtmlTagNameSyntaxNode: constructs with both leading and trailing trivia", (context: TestContext) => {
    const leading = new TriviaSyntaxNode("\t", null!);
    const trailing = new TriviaSyntaxNode("\n", null!);
    const node = new HtmlTagNameSyntaxNode([new TestNode()], leading, trailing);

    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("HtmlTagNameSyntaxNode: is instance of CompositeSyntaxNode, NameSyntaxNode, and SyntaxNode", (context: TestContext) => {
    const node = new HtmlTagNameSyntaxNode([new TestNode()]);

    context.assert.ok(node instanceof HtmlTagNameSyntaxNode);
    context.assert.ok(node instanceof NameSyntaxNode);
    context.assert.ok(node instanceof CompositeSyntaxNode);
    context.assert.ok(node instanceof SyntaxNode);
});

test("HtmlTagNameSyntaxNode: can be subclassed with extra properties", (context: TestContext) => {
    class ExtendedTagName extends HtmlTagNameSyntaxNode { public extra = "attr"; }
    const node = new ExtendedTagName([new TestNode()]);
    
    context.assert.strictEqual(node.extra, "attr");
    context.assert.ok(node instanceof HtmlTagNameSyntaxNode);
    context.assert.ok(node instanceof NameSyntaxNode);
});