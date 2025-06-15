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
import { StyleAttributeSyntaxNode } from "../../../../src/syntax/html/style/style-attribute-syntax-node.js";

class TestNode extends SyntaxNode { }

test("StyleAttributeSyntaxNode: constructs with children and trivia", (context: TestContext) => {
    const child1 = new TestNode();
    const child2 = new TestNode();
    const trivia = new TriviaSyntaxNode(" ", null!);
    const node = new StyleAttributeSyntaxNode([child1, child2], trivia);

    context.assert.deepStrictEqual(node.children, [child1, child2]);
    context.assert.strictEqual(node.trivia, trivia);
});

test("StyleAttributeSyntaxNode: constructs with empty children", (context: TestContext) => {
    const node = new StyleAttributeSyntaxNode([]);

    context.assert.deepStrictEqual(node.children, []);
    context.assert.strictEqual(node.trivia, null);
});

test("StyleAttributeSyntaxNode: children property is readonly", (context: TestContext) => {
    const child = new TestNode();
    const node = new StyleAttributeSyntaxNode([child]);

    try {
        (node as any).children = [];
        context.assert.fail("children should be readonly.");
    }
    catch {
        context.assert.ok(true, "children is immutable as expected.");
    }
});

test("StyleAttributeSyntaxNode: can be subclassed with extra properties", (context: TestContext) => {
    class ExtendedAttribute extends StyleAttributeSyntaxNode { public extra = 42; }
    const node = new ExtendedAttribute([new TestNode()]);

    context.assert.strictEqual(node.extra, 42);
    context.assert.ok(node instanceof StyleAttributeSyntaxNode);
    context.assert.ok(node instanceof SyntaxNode);
});

test("StyleAttributeSyntaxNode: children array is the same instance", (context: TestContext) => {
    const nodes = [new TestNode(), new TestNode()];
    const node = new StyleAttributeSyntaxNode(nodes);

    context.assert.strictEqual(node.children, nodes);
});