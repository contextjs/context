/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { SyntaxNode } from "../../../src/syntax/abstracts/syntax-node.js";
import { TriviaSyntaxNode } from "../../../src/syntax/common/trivia-syntax-node.js";

class TestSyntaxNode extends SyntaxNode { }

test("SyntaxNode: defaults to null for both trivia", (context: TestContext) => {
    const node = new TestSyntaxNode();

    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("SyntaxNode: assigns and reads leadingTrivia", (context: TestContext) => {
    const leading = new TriviaSyntaxNode(" ", null!);
    const node = new TestSyntaxNode(leading);

    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("SyntaxNode: assigns and reads trailingTrivia", (context: TestContext) => {
    const trailing = new TriviaSyntaxNode("\n", null!);
    const node = new TestSyntaxNode(null, trailing);

    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("SyntaxNode: assigns and reads both trivia", (context: TestContext) => {
    const leading = new TriviaSyntaxNode(" ", null!);
    const trailing = new TriviaSyntaxNode("\n", null!);
    const node = new TestSyntaxNode(leading, trailing);

    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("SyntaxNode: trivia can be explicitly set to null", (context: TestContext) => {
    const node = new TestSyntaxNode(null, null);

    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("SyntaxNode: inheritance in subclass works correctly for both trivia", (context: TestContext) => {
    class SubSyntaxNode extends SyntaxNode {
        public constructor(leadingTrivia: TriviaSyntaxNode | null = null, trailingTrivia: TriviaSyntaxNode | null = null) {
            super(leadingTrivia, trailingTrivia);
        }
    }
    const leading = new TriviaSyntaxNode(" ", null!);
    const trailing = new TriviaSyntaxNode("\n", null!);
    const node = new SubSyntaxNode(leading, trailing);

    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("SyntaxNode: performance with large syntax tree", (context: TestContext) => {
    const start = process.hrtime();

    let currentNode: SyntaxNode | null = new TestSyntaxNode();
    let triviaNode = new TriviaSyntaxNode("", null!);
    for (let i = 0; i < 1000000; i++)
        currentNode = new TestSyntaxNode(triviaNode, triviaNode);

    const end = process.hrtime(start);

    context.assert.ok(end[0] < 10, "Tree creation should complete in under 5 seconds");
});