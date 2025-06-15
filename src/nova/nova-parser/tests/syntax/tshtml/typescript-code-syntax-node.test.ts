/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { SyntaxNode } from "../../../src/syntax/abstracts/syntax-node";
import { TriviaSyntaxNode } from "../../../src/syntax/common/trivia-syntax-node";
import { TypescriptCodeSyntaxNode } from "../../../src/syntax/tshtml/typescript-code-syntax-node";

class TestNode extends SyntaxNode { }

test("TypescriptCodeSyntaxNode: constructs with children and trivia", (context: TestContext) => {
    const child1 = new TestNode();
    const child2 = new TestNode();
    const trivia = new TriviaSyntaxNode(" ", null!);
    const node = new TypescriptCodeSyntaxNode([child1, child2], trivia);

    context.assert.deepStrictEqual(node.children, [child1, child2]);
    context.assert.strictEqual(node.trivia, trivia);
});

test("TypescriptCodeSyntaxNode: constructs with empty children", (context: TestContext) => {
    const node = new TypescriptCodeSyntaxNode([]);

    context.assert.deepStrictEqual(node.children, []);
    context.assert.strictEqual(node.trivia, null);
});

test("TypescriptCodeSyntaxNode: children property is readonly", (context: TestContext) => {
    const child = new TestNode();
    const node = new TypescriptCodeSyntaxNode([child]);

    try {
        (node as any).children = [];
        context.assert.fail("children should be readonly.");
    }
    catch {
        context.assert.ok(true, "children is immutable as expected.");
    }
});

test("TypescriptCodeSyntaxNode: can be subclassed with extra properties", (context: TestContext) => {
    class ExtendedCodeNode extends TypescriptCodeSyntaxNode { public extra = 42; }
    const node = new ExtendedCodeNode([new TestNode()]);

    context.assert.strictEqual(node.extra, 42);
    context.assert.ok(node instanceof TypescriptCodeSyntaxNode);
    context.assert.ok(node instanceof SyntaxNode);
});

test("TypescriptCodeSyntaxNode: children array is the same instance", (context: TestContext) => {
    const nodes = [new TestNode(), new TestNode()];
    const node = new TypescriptCodeSyntaxNode(nodes);

    context.assert.strictEqual(node.children, nodes);
});