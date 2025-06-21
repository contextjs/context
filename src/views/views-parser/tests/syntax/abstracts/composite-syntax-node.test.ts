/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { CompositeSyntaxNode } from "../../../src/syntax/abstracts/composite-syntax-node.js";
import { SyntaxNode } from "../../../src/syntax/abstracts/syntax-node.js";
import { TriviaSyntaxNode } from "../../../src/syntax/common/trivia-syntax-node.js";

class TestNode extends SyntaxNode { }
class ConcreteCompositeNode extends CompositeSyntaxNode { }

test("CompositeSyntaxNode: constructs with children and leading trivia", (context: TestContext) => {
    const child1 = new TestNode();
    const child2 = new TestNode();
    const leading = new TriviaSyntaxNode(" ", null!);
    const node = new ConcreteCompositeNode([child1, child2], leading);

    context.assert.deepStrictEqual(node.children, [child1, child2]);
    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("CompositeSyntaxNode: constructs with children and trailing trivia", (context: TestContext) => {
    const child1 = new TestNode();
    const trailing = new TriviaSyntaxNode("\n", null!);
    const node = new ConcreteCompositeNode([child1], null, trailing);

    context.assert.deepStrictEqual(node.children, [child1]);
    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("CompositeSyntaxNode: constructs with children and both trivia", (context: TestContext) => {
    const child1 = new TestNode();
    const leading = new TriviaSyntaxNode(" ", null!);
    const trailing = new TriviaSyntaxNode("\n", null!);
    const node = new ConcreteCompositeNode([child1], leading, trailing);

    context.assert.deepStrictEqual(node.children, [child1]);
    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("CompositeSyntaxNode: constructs with empty children", (context: TestContext) => {
    const node = new ConcreteCompositeNode([]);

    context.assert.deepStrictEqual(node.children, []);
    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("CompositeSyntaxNode: can be subclassed with extra properties", (context: TestContext) => {
    class ExtendedComposite extends CompositeSyntaxNode { public extra = 42; }
    const node = new ExtendedComposite([new TestNode()]);

    context.assert.strictEqual(node.extra, 42);
    context.assert.ok(node instanceof CompositeSyntaxNode);
    context.assert.ok(node instanceof SyntaxNode);
});

test("CompositeSyntaxNode: children array is the same instance as input", (context: TestContext) => {
    const nodes = [new TestNode(), new TestNode()];
    const node = new ConcreteCompositeNode(nodes);

    context.assert.deepStrictEqual(node.children, nodes);
});

test("CompositeSyntaxNode: children can include nodes with their own trivia", (context: TestContext) => {
    const leading = new TriviaSyntaxNode(" ", null!);
    const trailing = new TriviaSyntaxNode("\t", null!);
    const child1 = new TestNode(leading, trailing);
    const child2 = new TestNode();
    const parent = new ConcreteCompositeNode([child1, child2]);
    
    context.assert.strictEqual(parent.children[0], child1);
    context.assert.strictEqual(parent.children[1], child2);
    context.assert.strictEqual((parent.children[0] as TestNode).leadingTrivia, leading);
    context.assert.strictEqual((parent.children[0] as TestNode).trailingTrivia, trailing);
});