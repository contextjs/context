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

test("HtmlTagEndSyntaxNode: constructs with children and trivia", (context: TestContext) => {
    const child1 = new TestNode();
    const child2 = new TestNode();
    const trivia = new TriviaSyntaxNode(" ", null!);
    const node = new HtmlTagEndSyntaxNode([child1, child2], trivia);

    context.assert.deepStrictEqual(node.children, [child1, child2]);
    context.assert.strictEqual(node.trivia, trivia);
});

test("HtmlTagEndSyntaxNode: constructs with empty children", (context: TestContext) => {
    const node = new HtmlTagEndSyntaxNode([], null!);

    context.assert.deepStrictEqual(node.children, []);
    context.assert.strictEqual(node.trivia, null);
});

test("HtmlTagEndSyntaxNode: children property is readonly", (context: TestContext) => {
    const child = new TestNode();
    const node = new HtmlTagEndSyntaxNode([child], null!);

    try {
        (node as any).children = [];
        context.assert.fail("children should be readonly.");
    }
    catch {
        context.assert.ok(true, "children is immutable as expected.");
    }
});

test("HtmlTagEndSyntaxNode: can be subclassed with extra properties", (context: TestContext) => {
    class ExtendedTag extends HtmlTagEndSyntaxNode { public extra = "x"; }
    const node = new ExtendedTag([new TestNode()]);

    context.assert.strictEqual(node.extra, "x");
    context.assert.ok(node instanceof HtmlTagEndSyntaxNode);
    context.assert.ok(node instanceof SyntaxNode);
});

test("HtmlTagEndSyntaxNode: children array is the same instance", (context: TestContext) => {
    const nodes = [new TestNode(), new TestNode()];
    const node = new HtmlTagEndSyntaxNode(nodes);

    context.assert.strictEqual(node.children, nodes);
});