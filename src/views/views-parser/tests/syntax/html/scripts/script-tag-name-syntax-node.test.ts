/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-script license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { CompositeSyntaxNode } from "../../../../src/syntax/abstracts/composite-syntax-node.js";
import { NameSyntaxNode } from "../../../../src/syntax/abstracts/name.syntax-node.js";
import { SyntaxNode } from "../../../../src/syntax/abstracts/syntax-node.js";
import { TriviaSyntaxNode } from "../../../../src/syntax/common/trivia-syntax-node.js";
import { ScriptTagNameSyntaxNode } from "../../../../src/syntax/html/scripts/script-tag-name-syntax-node.js";

class TestNode extends SyntaxNode { }
const leadingTrivia = new TriviaSyntaxNode("lead", null!);
const trailingTrivia = new TriviaSyntaxNode("trail", null!);

test("ScriptTagNameSyntaxNode: constructs with children and both trivia", (context: TestContext) => {
    const child1 = new TestNode();
    const child2 = new TestNode();
    const node = new ScriptTagNameSyntaxNode([child1, child2], leadingTrivia, trailingTrivia);

    context.assert.deepStrictEqual(node.children, [child1, child2]);
    context.assert.strictEqual(node.leadingTrivia, leadingTrivia);
    context.assert.strictEqual(node.trailingTrivia, trailingTrivia);
});

test("ScriptTagNameSyntaxNode: constructs with empty children", (context: TestContext) => {
    const node = new ScriptTagNameSyntaxNode([]);

    context.assert.deepStrictEqual(node.children, []);
    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("ScriptTagNameSyntaxNode: supports only leading trivia", (context: TestContext) => {
    const node = new ScriptTagNameSyntaxNode([new TestNode()], leadingTrivia);

    context.assert.strictEqual(node.leadingTrivia, leadingTrivia);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("ScriptTagNameSyntaxNode: supports only trailing trivia", (context: TestContext) => {
    const node = new ScriptTagNameSyntaxNode([new TestNode()], null, trailingTrivia);

    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, trailingTrivia);
});

test("ScriptTagNameSyntaxNode: is instance of all base classes", (context: TestContext) => {
    const node = new ScriptTagNameSyntaxNode([new TestNode()]);

    context.assert.ok(node instanceof ScriptTagNameSyntaxNode);
    context.assert.ok(node instanceof NameSyntaxNode);
    context.assert.ok(node instanceof CompositeSyntaxNode);
    context.assert.ok(node instanceof SyntaxNode);
});

test("ScriptTagNameSyntaxNode: can be subclassed with extra properties", (context: TestContext) => {
    class ExtendedScriptTagName extends ScriptTagNameSyntaxNode { public extra = "attr"; }
    const node = new ExtendedScriptTagName([new TestNode()]);

    context.assert.strictEqual(node.extra, "attr");
    context.assert.ok(node instanceof ScriptTagNameSyntaxNode);
    context.assert.ok(node instanceof NameSyntaxNode);
});

test("ScriptTagNameSyntaxNode: children array is the same instance", (context: TestContext) => {
    const nodes = [new TestNode(), new TestNode()];
    const node = new ScriptTagNameSyntaxNode(nodes);
    
    context.assert.strictEqual(node.children, nodes);
});