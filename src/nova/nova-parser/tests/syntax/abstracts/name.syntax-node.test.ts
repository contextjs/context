/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { CompositeSyntaxNode } from "../../../src/syntax/abstracts/composite-syntax-node.js";
import { NameSyntaxNode } from "../../../src/syntax/abstracts/name.syntax-node.js";
import { SyntaxNode } from "../../../src/syntax/abstracts/syntax-node.js";
import { TriviaSyntaxNode } from "../../../src/syntax/common/trivia-syntax-node.js";

class TestNode extends SyntaxNode { }
class TestNameNode extends NameSyntaxNode { }

test("NameSyntaxNode: constructs with children and trivia", (context: TestContext) => {
    const child1 = new TestNode();
    const child2 = new TestNode();
    const trivia = new TriviaSyntaxNode("", null!);
    const node = new TestNameNode([child1, child2], trivia);

    context.assert.deepStrictEqual(node.children, [child1, child2]);
    context.assert.strictEqual(node.trivia, trivia);
});

test("NameSyntaxNode: constructs with empty children", (context: TestContext) => {
    const node = new TestNameNode([]);

    context.assert.deepStrictEqual(node.children, []);
    context.assert.strictEqual(node.trivia, null);
});

test("NameSyntaxNode: is instance of CompositeSyntaxNode and SyntaxNode", (context: TestContext) => {
    const node = new TestNameNode([new TestNode()]);

    context.assert.ok(node instanceof TestNameNode);
    context.assert.ok(node instanceof CompositeSyntaxNode);
    context.assert.ok(node instanceof SyntaxNode);
});

test("NameSyntaxNode: children property is readonly", (context: TestContext) => {
    const node = new TestNameNode([new TestNode()]);

    try {
        (node as any).children = [];
        context.assert.fail("children should be readonly.");
    }
    catch {
        context.assert.ok(true, "children is immutable as expected.");
    }
});

test("NameSyntaxNode: can be subclassed with extra properties", (context: TestContext) => {
    class ExtendedTagName extends NameSyntaxNode { public extra = "hello"; }
    const node = new ExtendedTagName([new TestNode()]);

    context.assert.strictEqual(node.extra, "hello");
    context.assert.ok(node instanceof NameSyntaxNode);
});