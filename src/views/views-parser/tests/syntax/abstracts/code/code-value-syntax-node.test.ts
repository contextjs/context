/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { Location } from "../../../../src/sources/location.js";
import { CodeValueSyntaxNode } from "../../../../src/syntax/abstracts/code/code-value-syntax-node.js";
import { TriviaSyntaxNode } from "../../../../src/syntax/common/trivia-syntax-node.js";

class TestCodeValueSyntaxNode extends CodeValueSyntaxNode { }

function createLocation(): Location {
    return new Location(1, 2, 3, 4, "foo", []);
}

test("CodeValueSyntaxNode: constructs with value, location, and leading trivia", (context: TestContext) => {
    const location = createLocation();
    const leading = new TriviaSyntaxNode(" ", location);
    const node = new TestCodeValueSyntaxNode("abc", location, leading);

    context.assert.strictEqual(node.value, "abc");
    context.assert.strictEqual(node.location, location);
    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("CodeValueSyntaxNode: constructs with value, location, and trailing trivia", (context: TestContext) => {
    const location = createLocation();
    const trailing = new TriviaSyntaxNode("\n", location);
    const node = new TestCodeValueSyntaxNode("def", location, null, trailing);

    context.assert.strictEqual(node.value, "def");
    context.assert.strictEqual(node.location, location);
    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("CodeValueSyntaxNode: constructs with value, location, both trivia", (context: TestContext) => {
    const location = createLocation();
    const leading = new TriviaSyntaxNode("lead", location);
    const trailing = new TriviaSyntaxNode("trail", location);
    const node = new TestCodeValueSyntaxNode("ghi", location, leading, trailing);

    context.assert.strictEqual(node.value, "ghi");
    context.assert.strictEqual(node.location, location);
    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("CodeValueSyntaxNode: constructs with null trivia", (context: TestContext) => {
    const location = createLocation();
    const node = new TestCodeValueSyntaxNode("v", location);

    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("CodeValueSyntaxNode: constructs with null value", (context: TestContext) => {
    const location = createLocation();
    const node = new TestCodeValueSyntaxNode(null, location);

    context.assert.strictEqual(node.value, null);
});