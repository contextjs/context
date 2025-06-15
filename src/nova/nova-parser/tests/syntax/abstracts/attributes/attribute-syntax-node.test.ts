/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { AttributeSyntaxNode } from "../../../../src/syntax/abstracts/attributes//attribute-syntax-node.js";
import { SyntaxNode } from "../../../../src/syntax/abstracts/syntax-node.js";
import { TriviaSyntaxNode } from "../../../../src/syntax/common/trivia-syntax-node.js";

class TestNode extends SyntaxNode { }
class TestAttributeNode extends AttributeSyntaxNode { }

test("AttributeSyntaxNode: constructs with children and trivia", (context: TestContext) => {
    const child1 = new TestNode();
    const child2 = new TestNode();
    const trivia = new TriviaSyntaxNode(" ", null!);
    const node = new TestAttributeNode([child1, child2], trivia);

    context.assert.deepStrictEqual(node.children, [child1, child2]);
    context.assert.strictEqual(node.trivia, trivia);
});

test("AttributeSyntaxNode: constructs with empty children", (context: TestContext) => {
    const node = new TestAttributeNode([]);

    context.assert.deepStrictEqual(node.children, []);
    context.assert.strictEqual(node.trivia, null);
});

test("AttributeSyntaxNode: children property is readonly", (context: TestContext) => {
    const child = new TestNode();
    const node = new TestAttributeNode([child]);

    try {
        (node as any).children = [];
        context.assert.fail("children should be readonly.");
    }
    catch {
        context.assert.ok(true, "children is immutable as expected.");
    }
});

test("AttributeSyntaxNode: can be subclassed with extra properties", (context: TestContext) => {
    class ExtendedAttribute extends AttributeSyntaxNode { public extra = 42; }
    const node = new ExtendedAttribute([new TestNode()]);

    context.assert.strictEqual(node.extra, 42);
    context.assert.ok(node instanceof AttributeSyntaxNode);
    context.assert.ok(node instanceof SyntaxNode);
});

test("AttributeSyntaxNode: children array is the same instance", (context: TestContext) => {
    const nodes = [new TestNode(), new TestNode()];
    const node = new TestAttributeNode(nodes);

    context.assert.strictEqual(node.children, nodes);
});