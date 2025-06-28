/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { CompositeSyntaxNode } from "../../../src/syntax/abstracts/composite-syntax-node.js";
import { NameSyntaxNode } from "../../../src/syntax/abstracts/name-syntax-node.js";
import { SyntaxNode } from "../../../src/syntax/abstracts/syntax-node.js";
import { TriviaSyntaxNode } from "../../../src/syntax/common/trivia-syntax-node.js";

class TestNode extends SyntaxNode { }
class TestNameNode extends NameSyntaxNode { }

test("NameSyntaxNode: constructs with children and leading trivia", (context: TestContext) => {
    const child1 = new TestNode();
    const child2 = new TestNode();
    const leading = new TriviaSyntaxNode(" ", null!);
    const node = new TestNameNode([child1, child2], leading);

    context.assert.deepStrictEqual(node.children, [child1, child2]);
    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("NameSyntaxNode: constructs with children and trailing trivia", (context: TestContext) => {
    const child1 = new TestNode();
    const trailing = new TriviaSyntaxNode("\n", null!);
    const node = new TestNameNode([child1], null, trailing);

    context.assert.deepStrictEqual(node.children, [child1]);
    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("NameSyntaxNode: constructs with children and both trivia", (context: TestContext) => {
    const child1 = new TestNode();
    const leading = new TriviaSyntaxNode(" ", null!);
    const trailing = new TriviaSyntaxNode("\t", null!);
    const node = new TestNameNode([child1], leading, trailing);

    context.assert.deepStrictEqual(node.children, [child1]);
    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("NameSyntaxNode: constructs with empty children", (context: TestContext) => {
    const node = new TestNameNode([]);

    context.assert.deepStrictEqual(node.children, []);
    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("NameSyntaxNode: is instance of CompositeSyntaxNode and SyntaxNode", (context: TestContext) => {
    const node = new TestNameNode([new TestNode()]);

    context.assert.ok(node instanceof TestNameNode);
    context.assert.ok(node instanceof CompositeSyntaxNode);
    context.assert.ok(node instanceof SyntaxNode);
});

test("NameSyntaxNode: can be subclassed with extra properties", (context: TestContext) => {
    class ExtendedTagName extends NameSyntaxNode { public extra = "hello"; }
    const node = new ExtendedTagName([new TestNode()]);

    context.assert.strictEqual(node.extra, "hello");
    context.assert.ok(node instanceof NameSyntaxNode);
});