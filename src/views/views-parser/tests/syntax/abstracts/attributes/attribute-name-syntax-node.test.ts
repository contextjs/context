/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { AttributeNameSyntaxNode } from "../../../../src/syntax/abstracts/attributes/attribute-name-syntax-node.js";
import { CompositeSyntaxNode } from "../../../../src/syntax/abstracts/composite-syntax-node.js";
import { NameSyntaxNode } from "../../../../src/syntax/abstracts/name-syntax-node.js";
import { SyntaxNode } from "../../../../src/syntax/abstracts/syntax-node.js";
import { TriviaSyntaxNode } from "../../../../src/syntax/common/trivia-syntax-node.js";

class TestNode extends SyntaxNode { }
class TestAttributeNameSyntaxNode extends AttributeNameSyntaxNode { }

test("AttributeNameSyntaxNode: constructs with children and leading trivia", (context: TestContext) => {
    const child1 = new TestNode();
    const child2 = new TestNode();
    const leading = new TriviaSyntaxNode(" ", null!);
    const node = new TestAttributeNameSyntaxNode([child1, child2], leading);

    context.assert.deepStrictEqual(node.children, [child1, child2]);
    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("AttributeNameSyntaxNode: constructs with children and trailing trivia", (context: TestContext) => {
    const child = new TestNode();
    const trailing = new TriviaSyntaxNode("\n", null!);
    const node = new TestAttributeNameSyntaxNode([child], null, trailing);

    context.assert.deepStrictEqual(node.children, [child]);
    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("AttributeNameSyntaxNode: constructs with children and both trivia", (context: TestContext) => {
    const child = new TestNode();
    const leading = new TriviaSyntaxNode(" ", null!);
    const trailing = new TriviaSyntaxNode("\t", null!);
    const node = new TestAttributeNameSyntaxNode([child], leading, trailing);

    context.assert.deepStrictEqual(node.children, [child]);
    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("AttributeNameSyntaxNode: constructs with empty children", (context: TestContext) => {
    const node = new TestAttributeNameSyntaxNode([]);

    context.assert.deepStrictEqual(node.children, []);
    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("AttributeNameSyntaxNode: is instance of CompositeSyntaxNode, NameSyntaxNode, and SyntaxNode", (context: TestContext) => {
    const node = new TestAttributeNameSyntaxNode([new TestNode()]);

    context.assert.ok(node instanceof TestAttributeNameSyntaxNode);
    context.assert.ok(node instanceof NameSyntaxNode);
    context.assert.ok(node instanceof CompositeSyntaxNode);
    context.assert.ok(node instanceof SyntaxNode);
});

test("AttributeNameSyntaxNode: can be subclassed with extra properties", (context: TestContext) => {
    class ExtendedAttributeName extends AttributeNameSyntaxNode { public extra = "attr"; }
    const node = new ExtendedAttributeName([new TestNode()]);

    context.assert.strictEqual(node.extra, "attr");
    context.assert.ok(node instanceof AttributeNameSyntaxNode);
    context.assert.ok(node instanceof NameSyntaxNode);
});