/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Location } from "@contextjs/views";
import test, { TestContext } from "node:test";
import { CodeExpressionSyntaxNode } from "../../../../src/syntax/abstracts/code/code-expression-syntax-node.js";
import { TransitionSyntaxNode } from "../../../../src/syntax/common/transition-syntax-node.js";
import { TriviaSyntaxNode } from "../../../../src/syntax/common/trivia-syntax-node.js";
import { TestCodeValueSyntaxNode } from "../../../_fixtures/parsers-fixtures.js";

class TestCodeExpressionNode extends CodeExpressionSyntaxNode { }

const location = new Location(1, 2, 3, 4, "x", []);

test("CodeExpressionSyntaxNode: constructs with all fields", (context: TestContext) => {
    const transition = new TransitionSyntaxNode("@", location);
    const value = new TestCodeValueSyntaxNode("model.userName", location);
    const leading = new TriviaSyntaxNode("  ", location);
    const trailing = new TriviaSyntaxNode("\n", location);
    const node = new TestCodeExpressionNode(transition, value, leading, trailing);

    context.assert.strictEqual(node.transition, transition);
    context.assert.strictEqual(node.value, value);
    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("CodeExpressionSyntaxNode: constructs with only required fields (no trivia)", (context: TestContext) => {
    const transition = new TransitionSyntaxNode("@", location);
    const value = new TestCodeValueSyntaxNode("x", location);
    const node = new TestCodeExpressionNode(transition, value, null, null);

    context.assert.strictEqual(node.transition, transition);
    context.assert.strictEqual(node.value, value);
    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("CodeExpressionSyntaxNode: constructs with only leading trivia", (context: TestContext) => {
    const transition = new TransitionSyntaxNode("@", location);
    const value = new TestCodeValueSyntaxNode("abc", location);
    const leading = new TriviaSyntaxNode("// lead", location);
    const node = new TestCodeExpressionNode(transition, value, leading, null);

    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("CodeExpressionSyntaxNode: constructs with only trailing trivia", (context: TestContext) => {
    const transition = new TransitionSyntaxNode("@", location);
    const value = new TestCodeValueSyntaxNode("abc", location);
    const trailing = new TriviaSyntaxNode("/*trailing*/", location);
    const node = new TestCodeExpressionNode(transition, value, null, trailing);

    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("CodeExpressionSyntaxNode: properties are read-only and match inputs", (context: TestContext) => {
    const transition = new TransitionSyntaxNode("@", location);
    const value = new TestCodeValueSyntaxNode("user", location);
    const node = new TestCodeExpressionNode(transition, value, null, null);

    context.assert.strictEqual(node.transition, transition);
    context.assert.strictEqual(node.value, value);
});

test("CodeExpressionSyntaxNode: can be subclassed with extra properties", (context: TestContext) => {
    class ExtendedExpressionNode extends CodeExpressionSyntaxNode { public extra = 99; }
    const transition = new TransitionSyntaxNode("@", location);
    const value = new TestCodeValueSyntaxNode("foo", location);
    const node = new ExtendedExpressionNode(transition, value, null, null);

    context.assert.strictEqual(node.extra, 99);
    context.assert.ok(node instanceof CodeExpressionSyntaxNode);
});

test("CodeExpressionSyntaxNode: preserves reference to transition and value", (context: TestContext) => {
    const transition = new TransitionSyntaxNode("@", location);
    const value = new TestCodeValueSyntaxNode("z", location);
    const node = new TestCodeExpressionNode(transition, value, null, null);

    context.assert.strictEqual(node.transition, transition);
    context.assert.strictEqual(node.value, value);
});

test("CodeExpressionSyntaxNode: location can be a unique instance per node", (context: TestContext) => {
    const location1 = new Location(0, 0, 0, 1, "a", []);
    const location2 = new Location(2, 3, 4, 5, "b", []);
    const transition = new TransitionSyntaxNode("@", location1);
    const value = new TestCodeValueSyntaxNode("x", location2);
    const node = new TestCodeExpressionNode(transition, value, null, null);

    context.assert.strictEqual(node.transition.location, location1);
    context.assert.strictEqual(node.value.location, location2);
});