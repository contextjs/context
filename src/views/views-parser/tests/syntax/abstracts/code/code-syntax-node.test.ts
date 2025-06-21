/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { CodeSyntaxNode } from "../../../../src/syntax/abstracts/code/code-syntax-node.js";
import { SyntaxNode } from "../../../../src/syntax/abstracts/syntax-node.js";
import { TriviaSyntaxNode } from "../../../../src/syntax/common/trivia-syntax-node.js";

class TestNode extends SyntaxNode { }
class TestCodeSyntaxNode extends CodeSyntaxNode { }

test("CodeSyntaxNode: constructs with children and leading trivia", (context: TestContext) => {
    const child1 = new TestNode();
    const child2 = new TestNode();
    const leading = new TriviaSyntaxNode(" ", null!);
    const node = new TestCodeSyntaxNode([child1, child2], leading);

    context.assert.deepStrictEqual(node.children, [child1, child2]);
    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("CodeSyntaxNode: constructs with children and trailing trivia", (context: TestContext) => {
    const child = new TestNode();
    const trailing = new TriviaSyntaxNode("\n", null!);
    const node = new TestCodeSyntaxNode([child], null, trailing);

    context.assert.deepStrictEqual(node.children, [child]);
    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("CodeSyntaxNode: constructs with children and both trivia", (context: TestContext) => {
    const child = new TestNode();
    const leading = new TriviaSyntaxNode(" ", null!);
    const trailing = new TriviaSyntaxNode("\t", null!);
    const node = new TestCodeSyntaxNode([child], leading, trailing);

    context.assert.deepStrictEqual(node.children, [child]);
    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("CodeSyntaxNode: constructs with empty children", (context: TestContext) => {
    const node = new TestCodeSyntaxNode([]);

    context.assert.deepStrictEqual(node.children, []);
    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("CodeSyntaxNode: can be subclassed with extra properties", (context: TestContext) => {
    class ExtendedCodeNode extends CodeSyntaxNode { public extra = 42; }
    const node = new ExtendedCodeNode([new TestNode()]);

    context.assert.strictEqual(node.extra, 42);
    context.assert.ok(node instanceof CodeSyntaxNode);
    context.assert.ok(node instanceof SyntaxNode);
});

test("CodeSyntaxNode: children array is the same instance", (context: TestContext) => {
    const nodes = [new TestNode(), new TestNode()];
    const node = new TestCodeSyntaxNode(nodes);

    context.assert.strictEqual(node.children, nodes);
});