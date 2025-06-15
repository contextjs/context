/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { Location } from "../../../src/sources/location.js";
import { TriviaSyntaxNode } from "../../../src/syntax/common/trivia-syntax-node.js";
import { TypescriptCodeValueSyntaxNode } from "../../../src/syntax/tshtml/typescript-code-value-syntax-node.js";

function createLocation(): Location {
    return new Location(1, 2, 3, 4, "foo", []);
}

test("TypescriptCodeValueSyntaxNode: constructs with value, location, and trivia", (context: TestContext) => {
    const location = createLocation();
    const trivia = new TriviaSyntaxNode(" ", location);
    const node = new TypescriptCodeValueSyntaxNode("abc", location, trivia);

    context.assert.strictEqual(node.value, "abc");
    context.assert.strictEqual(node.location, location);
    context.assert.strictEqual(node.trivia, trivia);
});

test("TypescriptCodeValueSyntaxNode: constructs with null trivia", (context: TestContext) => {
    const location = createLocation();
    const node = new TypescriptCodeValueSyntaxNode("v", location);

    context.assert.strictEqual(node.trivia, null);
});

test("TypescriptCodeValueSyntaxNode: constructs with null value", (context: TestContext) => {
    const location = createLocation();
    const node = new TypescriptCodeValueSyntaxNode(null, location);

    context.assert.strictEqual(node.value, null);
});

test("TypescriptCodeValueSyntaxNode: value property is readonly", (context: TestContext) => {
    const location = createLocation();
    const node = new TypescriptCodeValueSyntaxNode("foo", location);

    try {
        (node as any).value = "bar";
        context.assert.fail("value should be readonly.");
    }
    catch {
        context.assert.ok(true, "value is immutable as expected.");
    }
});

test("TypescriptCodeValueSyntaxNode: location property is readonly", (context: TestContext) => {
    const location = createLocation();
    const node = new TypescriptCodeValueSyntaxNode("foo", location);

    try {
        (node as any).location = createLocation();
        context.assert.fail("location should be readonly.");
    }
    catch {
        context.assert.ok(true, "location is immutable as expected.");
    }
});

test("TypescriptCodeValueSyntaxNode: value cannot be undefined", (context: TestContext) => {
    const location = createLocation();
    try {
        new TypescriptCodeValueSyntaxNode(undefined as any, location);
        context.assert.fail("Value cannot be undefined.");
    }
    catch {
        context.assert.ok(true, "Undefined value is correctly prevented.");
    }
});