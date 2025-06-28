/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { SyntaxNode } from "../../../src/syntax/abstracts/syntax-node.js";
import { TransitionSyntaxNode } from "../../../src/syntax/common/transition-syntax-node.js";
import { TriviaSyntaxNode } from "../../../src/syntax/common/trivia-syntax-node.js";
import { TypescriptCodeBlockSyntaxNode } from "../../../src/syntax/typescript/typescript-code-block-syntax-node.js";
import { TestBraceSyntaxNode, TestNode } from "../../_fixtures/parsers-fixtures.js";

test("TypescriptCodeBlockSyntaxNode: constructs with all required fields and no trivia", (context: TestContext) => {
    const transition = new TransitionSyntaxNode("@", null!);
    const opening = new TestBraceSyntaxNode("{", null!);
    const closing = new TestBraceSyntaxNode("}", null!);
    const children = [new TestNode(), new TestNode()];
    const node = new TypescriptCodeBlockSyntaxNode(transition, opening, children, closing);

    context.assert.strictEqual(node.transition, transition);
    context.assert.strictEqual(node.openingBrace, opening);
    context.assert.strictEqual(node.closingBrace, closing);
    context.assert.deepStrictEqual(node.children, children);
    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("TypescriptCodeBlockSyntaxNode: constructs with leading trivia only", (context: TestContext) => {
    const transition = new TransitionSyntaxNode("@", null!);
    const opening = new TestBraceSyntaxNode("{", null!);
    const closing = new TestBraceSyntaxNode("}", null!);
    const leading = new TriviaSyntaxNode("/* lead */", null!);
    const node = new TypescriptCodeBlockSyntaxNode(transition, opening, [new TestNode()], closing, leading);

    context.assert.strictEqual(node.transition, transition);
    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("TypescriptCodeBlockSyntaxNode: constructs with trailing trivia only", (context: TestContext) => {
    const transition = new TransitionSyntaxNode("@", null!);
    const opening = new TestBraceSyntaxNode("{", null!);
    const closing = new TestBraceSyntaxNode("}", null!);
    const trailing = new TriviaSyntaxNode("// trail", null!);
    const node = new TypescriptCodeBlockSyntaxNode(transition, opening, [new TestNode()], closing, null, trailing);

    context.assert.strictEqual(node.transition, transition);
    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("TypescriptCodeBlockSyntaxNode: constructs with both leading and trailing trivia", (context: TestContext) => {
    const transition = new TransitionSyntaxNode("@", null!);
    const opening = new TestBraceSyntaxNode("{", null!);
    const closing = new TestBraceSyntaxNode("}", null!);
    const leading = new TriviaSyntaxNode("\t", null!);
    const trailing = new TriviaSyntaxNode("  ", null!);
    const node = new TypescriptCodeBlockSyntaxNode(transition, opening, [new TestNode()], closing, leading, trailing);

    context.assert.strictEqual(node.transition, transition);
    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("TypescriptCodeBlockSyntaxNode: can be subclassed with extra properties", (context: TestContext) => {
    class ExtendedNode extends TypescriptCodeBlockSyntaxNode { public extra = "code"; }
    const transition = new TransitionSyntaxNode("@", null!);
    const opening = new TestBraceSyntaxNode("{", null!);
    const closing = new TestBraceSyntaxNode("}", null!);
    const node = new ExtendedNode(transition, opening, [new TestNode()], closing);

    context.assert.strictEqual(node.transition.value, "@");
    context.assert.strictEqual(node.extra, "code");
    context.assert.ok(node instanceof TypescriptCodeBlockSyntaxNode);
    context.assert.ok(node instanceof SyntaxNode);
});

test("TypescriptCodeBlockSyntaxNode: children array is the same instance", (context: TestContext) => {
    const transition = new TransitionSyntaxNode("@", null!);
    const opening = new TestBraceSyntaxNode("{", null!);
    const closing = new TestBraceSyntaxNode("}", null!);
    const children = [new TestNode(), new TestNode()];
    const node = new TypescriptCodeBlockSyntaxNode(transition, opening, children, closing);

    context.assert.strictEqual(node.children, children);
});
