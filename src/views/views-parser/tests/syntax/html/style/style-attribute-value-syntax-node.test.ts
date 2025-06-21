/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { SyntaxNode } from "../../../../src/syntax/abstracts/syntax-node.js";
import { TriviaSyntaxNode } from "../../../../src/syntax/common/trivia-syntax-node.js";
import { StyleAttributeValueSyntaxNode } from "../../../../src/syntax/html/style/style-attribute-value-syntax-node.js";

class TestNode extends SyntaxNode { }

test("StyleAttributeValueSyntaxNode: constructs with children, trivia defaults to null", (context: TestContext) => {
    const child1 = new TestNode();
    const child2 = new TestNode();
    const node = new StyleAttributeValueSyntaxNode([child1, child2]);

    context.assert.deepStrictEqual(node.children, [child1, child2]);
    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("StyleAttributeValueSyntaxNode: constructs with empty children", (context: TestContext) => {
    const node = new StyleAttributeValueSyntaxNode([]);

    context.assert.deepStrictEqual(node.children, []);
    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("StyleAttributeValueSyntaxNode: supports leading trivia", (context: TestContext) => {
    const leading = new TriviaSyntaxNode("lead", null!);
    const node = new StyleAttributeValueSyntaxNode([new TestNode()], leading);

    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("StyleAttributeValueSyntaxNode: supports trailing trivia", (context: TestContext) => {
    const trailing = new TriviaSyntaxNode("trail", null!);
    const node = new StyleAttributeValueSyntaxNode([new TestNode()], null, trailing);

    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("StyleAttributeValueSyntaxNode: supports both leading and trailing trivia", (context: TestContext) => {
    const leading = new TriviaSyntaxNode("lead", null!);
    const trailing = new TriviaSyntaxNode("trail", null!);
    const node = new StyleAttributeValueSyntaxNode([new TestNode()], leading, trailing);

    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("StyleAttributeValueSyntaxNode: can be subclassed with extra properties", (context: TestContext) => {
    class ExtendedAttributeValue extends StyleAttributeValueSyntaxNode { public extra = "x"; }
    const node = new ExtendedAttributeValue([new TestNode()]);

    context.assert.strictEqual(node.extra, "x");
    context.assert.ok(node instanceof StyleAttributeValueSyntaxNode);
    context.assert.ok(node instanceof SyntaxNode);
});

test("StyleAttributeValueSyntaxNode: children array is the same instance", (context: TestContext) => {
    const nodes = [new TestNode(), new TestNode()];
    const node = new StyleAttributeValueSyntaxNode(nodes);

    context.assert.strictEqual(node.children, nodes);
});