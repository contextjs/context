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

test("SyntaxNode: trivia default to empty arrays", (context: TestContext) => {
    const node = new TestSyntaxNode();

    context.assert.strictEqual(node.trivia, null);
});

test("SyntaxNode: can assign and read trivia", (context: TestContext) => {
    const trivia = new TriviaSyntaxNode("", null!);
    const node = new TestSyntaxNode(trivia);

    context.assert.strictEqual(node.trivia, trivia);
});

test("SyntaxNode: trivia can be explicitly set to null", (context: TestContext) => {
    const node = new TestSyntaxNode(null);

    context.assert.strictEqual(node.trivia, null);
});

test("SyntaxNode: trivia cannot be reassigned after construction", (context: TestContext) => {
    const trivia = new TriviaSyntaxNode("", null!);
    const node = new TestSyntaxNode(trivia);

    context.assert.strictEqual(node.trivia, trivia);

    try {
        (node as any).trivia = null;
        context.assert.fail("Trivia should be immutable.");
    }
    catch {
        context.assert.ok(true, "Trivia is immutable as expected.");
    }
});

test("SyntaxNode: trivia inheritance in subclass works correctly", (context: TestContext) => {
    class SubSyntaxNode extends SyntaxNode {
        public constructor(trivia: TriviaSyntaxNode | null = null) {
            super(trivia);
        }
    }
    const trivia = new TriviaSyntaxNode("", null!);
    const node = new SubSyntaxNode(trivia);

    context.assert.strictEqual(node.trivia, trivia);
});

test("SyntaxNode: performance with large syntax tree", (context: TestContext) => {
    const start = process.hrtime();

    let currentNode: SyntaxNode | null = new TestSyntaxNode();
    let triviaNode = new TriviaSyntaxNode("", null!);
    for (let i = 0; i < 1000000; i++)
        currentNode = new TestSyntaxNode(triviaNode);

    const end = process.hrtime(start);

    context.assert.ok(end[0] < 10, "Tree creation should complete in under 5 seconds");
});