/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Location } from "@contextjs/views";
import test, { TestContext } from "node:test";
import { TransitionSyntaxNode } from "../../../src/syntax/common/transition-syntax-node.js";
import { TriviaSyntaxNode } from "../../../src/syntax/common/trivia-syntax-node.js";
import { TypescriptCodeExpressionSyntaxNode } from "../../../src/syntax/typescript/typescript-code-expression-syntax-node.js";
import { TestCodeValueSyntaxNode } from "../../_fixtures/parsers-fixtures.js";

const location = new Location(1, 2, 3, 4, "x", []);

test("TypescriptCodeExpressionSyntaxNode: constructs with all fields", (context: TestContext) => {
    const transition = new TransitionSyntaxNode("@", location);
    const value = new TestCodeValueSyntaxNode("model.userName", location);
    const leading = new TriviaSyntaxNode("  ", location);
    const trailing = new TriviaSyntaxNode("\n", location);
    const node = new TypescriptCodeExpressionSyntaxNode(transition, value, leading, trailing);

    context.assert.strictEqual(node.transition, transition);
    context.assert.strictEqual(node.value, value);
    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("TypescriptCodeExpressionSyntaxNode: constructs with only required fields (no trivia)", (context: TestContext) => {
    const transition = new TransitionSyntaxNode("@", location);
    const value = new TestCodeValueSyntaxNode("x", location);
    const node = new TypescriptCodeExpressionSyntaxNode(transition, value, null, null);

    context.assert.strictEqual(node.transition, transition);
    context.assert.strictEqual(node.value, value);
    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("TypescriptCodeExpressionSyntaxNode: constructs with only leading trivia", (context: TestContext) => {
    const transition = new TransitionSyntaxNode("@", location);
    const value = new TestCodeValueSyntaxNode("abc", location);
    const leading = new TriviaSyntaxNode("// lead", location);
    const node = new TypescriptCodeExpressionSyntaxNode(transition, value, leading, null);

    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("TypescriptCodeExpressionSyntaxNode: constructs with only trailing trivia", (context: TestContext) => {
    const transition = new TransitionSyntaxNode("@", location);
    const value = new TestCodeValueSyntaxNode("abc", location);
    const trailing = new TriviaSyntaxNode("/*trailing*/", location);
    const node = new TypescriptCodeExpressionSyntaxNode(transition, value, null, trailing);

    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("TypescriptCodeExpressionSyntaxNode: preserves reference to transition and value", (context: TestContext) => {
    const transition = new TransitionSyntaxNode("@", location);
    const value = new TestCodeValueSyntaxNode("z", location);
    const node = new TypescriptCodeExpressionSyntaxNode(transition, value, null, null);

    context.assert.strictEqual(node.transition, transition);
    context.assert.strictEqual(node.value, value);
});

test("TypescriptCodeExpressionSyntaxNode: can be subclassed with extra properties", (context: TestContext) => {
    class ExtendedExpressionNode extends TypescriptCodeExpressionSyntaxNode { public extra = 101; }
    const transition = new TransitionSyntaxNode("@", location);
    const value = new TestCodeValueSyntaxNode("foo", location);
    const node = new ExtendedExpressionNode(transition, value, null, null);

    context.assert.strictEqual(node.extra, 101);
    context.assert.ok(node instanceof TypescriptCodeExpressionSyntaxNode);
});