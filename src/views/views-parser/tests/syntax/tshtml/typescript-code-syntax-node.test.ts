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
import { TypescriptCodeSyntaxNode } from "../../../src/syntax/tshtml/typescript-code-syntax-node.js";

class TestNode extends SyntaxNode { }

test("TypescriptCodeSyntaxNode: constructs with children and no trivia", (context: TestContext) => {
    const child1 = new TestNode();
    const child2 = new TestNode();
    const node = new TypescriptCodeSyntaxNode([child1, child2]);

    context.assert.deepStrictEqual(node.children, [child1, child2]);
    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("TypescriptCodeSyntaxNode: constructs with leading trivia only", (context: TestContext) => {
    const leading = new TriviaSyntaxNode(" ", null!);
    const node = new TypescriptCodeSyntaxNode([new TestNode()], leading);

    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("TypescriptCodeSyntaxNode: constructs with trailing trivia only", (context: TestContext) => {
    const trailing = new TriviaSyntaxNode("\n", null!);
    const node = new TypescriptCodeSyntaxNode([new TestNode()], null, trailing);

    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("TypescriptCodeSyntaxNode: constructs with both leading and trailing trivia", (context: TestContext) => {
    const leading = new TriviaSyntaxNode("\t", null!);
    const trailing = new TriviaSyntaxNode("  ", null!);
    const node = new TypescriptCodeSyntaxNode([new TestNode()], leading, trailing);

    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("TypescriptCodeSyntaxNode: can be subclassed with extra properties", (context: TestContext) => {
    class ExtendedNode extends TypescriptCodeSyntaxNode { public extra = "code"; }
    const node = new ExtendedNode([new TestNode()]);
    
    context.assert.strictEqual(node.extra, "code");
    context.assert.ok(node instanceof TypescriptCodeSyntaxNode);
    context.assert.ok(node instanceof SyntaxNode);
});

test("TypescriptCodeSyntaxNode: children array is the same instance", (context: TestContext) => {
    const children = [new TestNode(), new TestNode()];
    const node = new TypescriptCodeSyntaxNode(children);

    context.assert.strictEqual(node.children, children);
});