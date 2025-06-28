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
import { HtmlAttributeNameSyntaxNode } from "../../../../src/syntax/html/attributes/html-attribute-name-syntax-node.js";

class TestNode extends SyntaxNode { }

test("HtmlAttributeNameSyntaxNode: constructs with children, trivia defaults to null", (context: TestContext) => {
    const child1 = new TestNode();
    const child2 = new TestNode();
    const node = new HtmlAttributeNameSyntaxNode([child1, child2]);

    context.assert.deepStrictEqual(node.children, [child1, child2]);
    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("HtmlAttributeNameSyntaxNode: constructs with empty children", (context: TestContext) => {
    const node = new HtmlAttributeNameSyntaxNode([]);

    context.assert.deepStrictEqual(node.children, []);
    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("HtmlAttributeNameSyntaxNode: supports leading trivia", (context: TestContext) => {
    const leading = new TriviaSyntaxNode("lead", null!);
    const node = new HtmlAttributeNameSyntaxNode([new TestNode()], leading);

    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("HtmlAttributeNameSyntaxNode: supports trailing trivia", (context: TestContext) => {
    const trailing = new TriviaSyntaxNode("trail", null!);
    const node = new HtmlAttributeNameSyntaxNode([new TestNode()], null, trailing);

    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("HtmlAttributeNameSyntaxNode: supports both leading and trailing trivia", (context: TestContext) => {
    const leading = new TriviaSyntaxNode("lead", null!);
    const trailing = new TriviaSyntaxNode("trail", null!);
    const node = new HtmlAttributeNameSyntaxNode([new TestNode()], leading, trailing);

    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("HtmlAttributeNameSyntaxNode: is instance of CompositeSyntaxNode, NameSyntaxNode, and SyntaxNode", (context: TestContext) => {
    const node = new HtmlAttributeNameSyntaxNode([new TestNode()]);

    context.assert.ok(node instanceof HtmlAttributeNameSyntaxNode);
    context.assert.ok(node instanceof NameSyntaxNode);
    context.assert.ok(node instanceof CompositeSyntaxNode);
    context.assert.ok(node instanceof SyntaxNode);
});

test("HtmlAttributeNameSyntaxNode: can be subclassed with extra properties", (context: TestContext) => {
    class ExtendedAttributeName extends HtmlAttributeNameSyntaxNode { public extra = "attr"; }
    const node = new ExtendedAttributeName([new TestNode()]);

    context.assert.strictEqual(node.extra, "attr");
    context.assert.ok(node instanceof HtmlAttributeNameSyntaxNode);
    context.assert.ok(node instanceof NameSyntaxNode);
});