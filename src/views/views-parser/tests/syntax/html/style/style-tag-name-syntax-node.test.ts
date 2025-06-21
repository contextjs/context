/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { CompositeSyntaxNode } from "../../../../src/syntax/abstracts/composite-syntax-node.js";
import { NameSyntaxNode } from "../../../../src/syntax/abstracts/name.syntax-node.js";
import { SyntaxNode } from "../../../../src/syntax/abstracts/syntax-node.js";
import { TriviaSyntaxNode } from "../../../../src/syntax/common/trivia-syntax-node.js";
import { StyleTagNameSyntaxNode } from "../../../../src/syntax/html/style/style-tag-name-syntax-node.js";

class TestNode extends SyntaxNode { }

test("StyleTagNameSyntaxNode: constructs with children and no trivia", (context: TestContext) => {
    const children = [new TestNode(), new TestNode()];
    const node = new StyleTagNameSyntaxNode(children);

    context.assert.deepStrictEqual(node.children, children);
    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("StyleTagNameSyntaxNode: constructs with leading trivia", (context: TestContext) => {
    const leading = new TriviaSyntaxNode("lead", null!);
    const node = new StyleTagNameSyntaxNode([new TestNode()], leading);

    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("StyleTagNameSyntaxNode: constructs with trailing trivia", (context: TestContext) => {
    const trailing = new TriviaSyntaxNode("trail", null!);
    const node = new StyleTagNameSyntaxNode([new TestNode()], null, trailing);

    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("StyleTagNameSyntaxNode: constructs with both trivia", (context: TestContext) => {
    const leading = new TriviaSyntaxNode("lead", null!);
    const trailing = new TriviaSyntaxNode("trail", null!);
    const node = new StyleTagNameSyntaxNode([new TestNode()], leading, trailing);

    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("StyleTagNameSyntaxNode: retains reference to original children array", (context: TestContext) => {
    const children = [new TestNode()];
    const node = new StyleTagNameSyntaxNode(children);

    context.assert.strictEqual(node.children, children);
});

test("StyleTagNameSyntaxNode: is instance of CompositeSyntaxNode, NameSyntaxNode, SyntaxNode", (context: TestContext) => {
    const node = new StyleTagNameSyntaxNode([new TestNode()]);

    context.assert.ok(node instanceof StyleTagNameSyntaxNode);
    context.assert.ok(node instanceof NameSyntaxNode);
    context.assert.ok(node instanceof CompositeSyntaxNode);
    context.assert.ok(node instanceof SyntaxNode);
});

test("StyleTagNameSyntaxNode: supports subclassing", (context: TestContext) => {
    class CustomTagName extends StyleTagNameSyntaxNode { public custom = "ok"; }

    const node = new CustomTagName([new TestNode()]);
    context.assert.strictEqual(node.custom, "ok");
    context.assert.ok(node instanceof StyleTagNameSyntaxNode);
});