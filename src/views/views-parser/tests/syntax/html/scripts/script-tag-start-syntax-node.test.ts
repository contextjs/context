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
import { ScriptTagStartSyntaxNode } from "../../../../src/syntax/html/scripts/script-tag-start-syntax-node.js";

class TestNode extends SyntaxNode { }
const leadingTrivia = new TriviaSyntaxNode("lead", null!);
const trailingTrivia = new TriviaSyntaxNode("trail", null!);

test("ScriptTagStartSyntaxNode: constructs with children and both trivia", (context: TestContext) => {
    const child1 = new TestNode();
    const child2 = new TestNode();
    const node = new ScriptTagStartSyntaxNode([child1, child2], leadingTrivia, trailingTrivia);

    context.assert.deepStrictEqual(node.children, [child1, child2]);
    context.assert.strictEqual(node.leadingTrivia, leadingTrivia);
    context.assert.strictEqual(node.trailingTrivia, trailingTrivia);
});

test("ScriptTagStartSyntaxNode: constructs with empty children", (context: TestContext) => {
    const node = new ScriptTagStartSyntaxNode([]);

    context.assert.deepStrictEqual(node.children, []);
    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("ScriptTagStartSyntaxNode: supports only leading trivia", (context: TestContext) => {
    const node = new ScriptTagStartSyntaxNode([new TestNode()], leadingTrivia);

    context.assert.strictEqual(node.leadingTrivia, leadingTrivia);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("ScriptTagStartSyntaxNode: supports only trailing trivia", (context: TestContext) => {
    const node = new ScriptTagStartSyntaxNode([new TestNode()], null, trailingTrivia);

    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, trailingTrivia);
});

test("ScriptTagStartSyntaxNode: can be subclassed with extra properties", (context: TestContext) => {
    class ExtendedTag extends ScriptTagStartSyntaxNode { public extra = "x"; }
    const node = new ExtendedTag([new TestNode()]);

    context.assert.strictEqual(node.extra, "x");
    context.assert.ok(node instanceof ScriptTagStartSyntaxNode);
    context.assert.ok(node instanceof SyntaxNode);
});

test("ScriptTagStartSyntaxNode: children array is the same instance", (context: TestContext) => {
    const nodes = [new TestNode(), new TestNode()];
    const node = new ScriptTagStartSyntaxNode(nodes);

    context.assert.strictEqual(node.children, nodes);
});