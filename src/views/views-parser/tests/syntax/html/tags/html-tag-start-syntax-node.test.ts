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
import { HtmlTagStartSyntaxNode } from "../../../../src/syntax/html/tags/html-tag-start-syntax-node.js";

class TestNode extends SyntaxNode { }

test("HtmlTagStartSyntaxNode: constructs with children and no trivia", (context: TestContext) => {
    const children = [new TestNode(), new TestNode()];
    const node = new HtmlTagStartSyntaxNode(children);

    context.assert.deepStrictEqual(node.children, children);
    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("HtmlTagStartSyntaxNode: constructs with leading trivia", (context: TestContext) => {
    const leading = new TriviaSyntaxNode(" ", null!);
    const node = new HtmlTagStartSyntaxNode([new TestNode()], leading);

    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("HtmlTagStartSyntaxNode: constructs with trailing trivia", (context: TestContext) => {
    const trailing = new TriviaSyntaxNode("  ", null!);
    const node = new HtmlTagStartSyntaxNode([new TestNode()], null, trailing);

    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("HtmlTagStartSyntaxNode: constructs with both leading and trailing trivia", (context: TestContext) => {
    const leading = new TriviaSyntaxNode("\t", null!);
    const trailing = new TriviaSyntaxNode("\n", null!);
    const node = new HtmlTagStartSyntaxNode([new TestNode()], leading, trailing);

    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("HtmlTagStartSyntaxNode: can be subclassed with extra properties", (context: TestContext) => {
    class Extended extends HtmlTagStartSyntaxNode { public extra = "value"; }
    const node = new Extended([new TestNode()]);
    
    context.assert.strictEqual(node.extra, "value");
    context.assert.ok(node instanceof HtmlTagStartSyntaxNode);
    context.assert.ok(node instanceof CompositeSyntaxNode);
    context.assert.ok(node instanceof SyntaxNode);
});

test("HtmlTagStartSyntaxNode: children array is the same instance", (context: TestContext) => {
    const nodes = [new TestNode(), new TestNode()];
    const node = new HtmlTagStartSyntaxNode(nodes);

    context.assert.strictEqual(node.children, nodes);
});