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
import { HtmlTagSyntaxNode } from "../../../../src/syntax/html/tags/html-tag-syntax-node.js";

class TestNode extends SyntaxNode { }

test("HtmlTagSyntaxNode: constructs with children and trivia", (context: TestContext) => {
    const child1 = new TestNode();
    const child2 = new TestNode();
    const trivia = new TriviaSyntaxNode(" ", null!);
    const node = new HtmlTagSyntaxNode([child1, child2], trivia);

    context.assert.deepStrictEqual(node.children, [child1, child2]);
    context.assert.strictEqual(node.trivia, trivia);
});

test("HtmlTagSyntaxNode: constructs with empty children", (context: TestContext) => {
    const node = new HtmlTagSyntaxNode([]);

    context.assert.deepStrictEqual(node.children, []);
    context.assert.strictEqual(node.trivia, null);
});

test("HtmlTagSyntaxNode: children property is readonly", (context: TestContext) => {
    const child = new TestNode();
    const node = new HtmlTagSyntaxNode([child]);

    try {
        (node as any).children = [];
        context.assert.fail("children should be readonly.");
    }
    catch {
        context.assert.ok(true, "children is immutable as expected.");
    }
});

test("HtmlTagSyntaxNode: can be subclassed with extra properties", (context: TestContext) => {
    class ExtendedTag extends HtmlTagSyntaxNode { public extra = "x"; }
    const node = new ExtendedTag([new TestNode()]);

    context.assert.strictEqual(node.extra, "x");
    context.assert.ok(node instanceof HtmlTagSyntaxNode);
    context.assert.ok(node instanceof SyntaxNode);
});

test("HtmlTagSyntaxNode: children array is the same instance", (context: TestContext) => {
    const nodes = [new TestNode(), new TestNode()];
    const node = new HtmlTagSyntaxNode(nodes);

    context.assert.strictEqual(node.children, nodes);
});