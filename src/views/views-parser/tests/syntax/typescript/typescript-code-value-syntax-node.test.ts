/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Location } from "@contextjs/views";
import test, { TestContext } from "node:test";
import { TriviaSyntaxNode } from "../../../src/syntax/common/trivia-syntax-node.js";
import { TypescriptCodeValueSyntaxNode } from "../../../src/syntax/typescript/typescript-code-value-syntax-node.js";

function createLocation(): Location {
    return new Location(1, 2, 3, 4, "foo", []);
}

test("TypescriptCodeValueSyntaxNode: constructs with value, location, leading and trailing trivia", (context: TestContext) => {
    const location = createLocation();
    const leading = new TriviaSyntaxNode(" ", location);
    const trailing = new TriviaSyntaxNode("\n", location);
    const node = new TypescriptCodeValueSyntaxNode("abc", location, leading, trailing);

    context.assert.strictEqual(node.value, "abc");
    context.assert.strictEqual(node.location, location);
    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("TypescriptCodeValueSyntaxNode: constructs with null trivia", (context: TestContext) => {
    const location = createLocation();
    const node = new TypescriptCodeValueSyntaxNode("v", location);

    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("TypescriptCodeValueSyntaxNode: constructs with null value", (context: TestContext) => {
    const location = createLocation();
    const node = new TypescriptCodeValueSyntaxNode(null, location);

    context.assert.strictEqual(node.value, null);
});