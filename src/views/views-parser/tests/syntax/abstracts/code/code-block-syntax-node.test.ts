/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { CodeBlockSyntaxNode } from "../../../../src/syntax/abstracts/code/code-block-syntax-node.js";
import { SyntaxNode } from "../../../../src/syntax/abstracts/syntax-node.js";
import { TransitionSyntaxNode } from "../../../../src/syntax/common/transition-syntax-node.js";
import { TriviaSyntaxNode } from "../../../../src/syntax/common/trivia-syntax-node.js";
import { TestBraceSyntaxNode, TestCodeBlockSyntaxNode, TestNode } from "../../../_fixtures/parsers-fixtures.js";

test("CodeBlockSyntaxNode: constructs with all fields", (context: TestContext) => {
    const transition = new TransitionSyntaxNode("@", null!);
    const opening = new TestBraceSyntaxNode("{", null!);
    const closing = new TestBraceSyntaxNode("}", null!);
    const child1 = new TestNode();
    const child2 = new TestNode();
    const leading = new TriviaSyntaxNode(" ", null!);
    const trailing = new TriviaSyntaxNode("\n", null!);
    const node = new TestCodeBlockSyntaxNode(transition, opening, [child1, child2], closing, leading, trailing);

    context.assert.strictEqual(node.transition, transition);
    context.assert.strictEqual(node.openingBrace, opening);
    context.assert.strictEqual(node.closingBrace, closing);
    context.assert.deepStrictEqual(node.children, [child1, child2]);
    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("CodeBlockSyntaxNode: constructs with only required fields", (context: TestContext) => {
    const transition = new TransitionSyntaxNode("@", null!);
    const opening = new TestBraceSyntaxNode("{", null!);
    const closing = new TestBraceSyntaxNode("}", null!);
    const node = new TestCodeBlockSyntaxNode(transition, opening, [], closing);

    context.assert.strictEqual(node.transition, transition);
    context.assert.strictEqual(node.openingBrace, opening);
    context.assert.strictEqual(node.closingBrace, closing);
    context.assert.deepStrictEqual(node.children, []);
    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("CodeBlockSyntaxNode: constructs with leading trivia only", (context: TestContext) => {
    const transition = new TransitionSyntaxNode("@", null!);
    const opening = new TestBraceSyntaxNode("{", null!);
    const closing = new TestBraceSyntaxNode("}", null!);
    const leading = new TriviaSyntaxNode("/* lead */", null!);
    const node = new TestCodeBlockSyntaxNode(transition, opening, [], closing, leading);

    context.assert.strictEqual(node.transition, transition);
    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("CodeBlockSyntaxNode: constructs with trailing trivia only", (context: TestContext) => {
    const transition = new TransitionSyntaxNode("@", null!);
    const opening = new TestBraceSyntaxNode("{", null!);
    const closing = new TestBraceSyntaxNode("}", null!);
    const trailing = new TriviaSyntaxNode("// trail", null!);
    const node = new TestCodeBlockSyntaxNode(transition, opening, [], closing, null, trailing);

    context.assert.strictEqual(node.transition, transition);
    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("CodeBlockSyntaxNode: children array is preserved", (context: TestContext) => {
    const transition = new TransitionSyntaxNode("@", null!);
    const opening = new TestBraceSyntaxNode("{", null!);
    const closing = new TestBraceSyntaxNode("}", null!);
    const nodes = [new TestNode(), new TestNode()];
    const node = new TestCodeBlockSyntaxNode(transition, opening, nodes, closing);

    context.assert.strictEqual(node.children, nodes);
});

test("CodeBlockSyntaxNode: can be subclassed with extra properties", (context: TestContext) => {
    class ExtendedCodeNode extends CodeBlockSyntaxNode { public extra = 42; }
    const transition = new TransitionSyntaxNode("@", null!);
    const opening = new TestBraceSyntaxNode("{", null!);
    const closing = new TestBraceSyntaxNode("}", null!);
    const node = new ExtendedCodeNode(transition, opening, [new TestNode()], closing);

    context.assert.strictEqual(node.transition.value, "@");
    context.assert.strictEqual(node.extra, 42);
    context.assert.ok(node instanceof CodeBlockSyntaxNode);
    context.assert.ok(node instanceof SyntaxNode);
});