/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-script license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { SyntaxNode } from "../../../../src/syntax/abstracts/syntax-node.js";
import { TriviaSyntaxNode } from "../../../../src/syntax/common/trivia-syntax-node.js";
import { ScriptTagEndSyntaxNode } from "../../../../src/syntax/html/scripts/script-tag-end-syntax-node.js";

class TestNode extends SyntaxNode { }
const leadingTrivia = new TriviaSyntaxNode("lead", null!);
const trailingTrivia = new TriviaSyntaxNode("trail", null!);

test("ScriptTagEndSyntaxNode: constructs with children and both trivia", (context: TestContext) => {
    const child1 = new TestNode();
    const child2 = new TestNode();
    const node = new ScriptTagEndSyntaxNode([child1, child2], leadingTrivia, trailingTrivia);

    context.assert.deepStrictEqual(node.children, [child1, child2]);
    context.assert.strictEqual(node.leadingTrivia, leadingTrivia);
    context.assert.strictEqual(node.trailingTrivia, trailingTrivia);
});

test("ScriptTagEndSyntaxNode: constructs with empty children", (context: TestContext) => {
    const node = new ScriptTagEndSyntaxNode([]);

    context.assert.deepStrictEqual(node.children, []);
    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("ScriptTagEndSyntaxNode: supports only leading trivia", (context: TestContext) => {
    const node = new ScriptTagEndSyntaxNode([new TestNode()], leadingTrivia);

    context.assert.strictEqual(node.leadingTrivia, leadingTrivia);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("ScriptTagEndSyntaxNode: supports only trailing trivia", (context: TestContext) => {
    const node = new ScriptTagEndSyntaxNode([new TestNode()], null, trailingTrivia);

    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, trailingTrivia);
});

test("ScriptTagEndSyntaxNode: can be subclassed with extra properties", (context: TestContext) => {
    class ExtendedTag extends ScriptTagEndSyntaxNode { public extra = "x"; }
    const node = new ExtendedTag([new TestNode()]);

    context.assert.strictEqual(node.extra, "x");
    context.assert.ok(node instanceof ScriptTagEndSyntaxNode);
    context.assert.ok(node instanceof SyntaxNode);
});

test("ScriptTagEndSyntaxNode: children array is the same instance", (context: TestContext) => {
    const nodes = [new TestNode(), new TestNode()];
    const node = new ScriptTagEndSyntaxNode(nodes);

    context.assert.strictEqual(node.children, nodes);
});