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

test("CodeValueSyntaxNode: constructs with value, location, and trivia", (context: TestContext) => {
    const location = createLocation();
    const trivia = new TriviaSyntaxNode(" ", location);
    const node = new TestCodeValueSyntaxNode("abc", location, trivia);

    context.assert.strictEqual(node.value, "abc");
    context.assert.strictEqual(node.location, location);
    context.assert.strictEqual(node.trivia, trivia);
});

test("CodeValueSyntaxNode: constructs with null trivia", (context: TestContext) => {
    const location = createLocation();
    const node = new TestCodeValueSyntaxNode("v", location);

    context.assert.strictEqual(node.trivia, null);
});

test("CodeValueSyntaxNode: constructs with null value", (context: TestContext) => {
    const location = createLocation();
    const node = new TestCodeValueSyntaxNode(null, location);

    context.assert.strictEqual(node.value, null);
});

test("CodeValueSyntaxNode: value property is readonly", (context: TestContext) => {
    const location = createLocation();
    const node = new TestCodeValueSyntaxNode("foo", location);

    try {
        (node as any).value = "bar";
        context.assert.fail("value should be readonly.");
    }
    catch {
        context.assert.ok(true, "value is immutable as expected.");
    }
});

test("CodeValueSyntaxNode: location property is readonly", (context: TestContext) => {
    const location = createLocation();
    const node = new TestCodeValueSyntaxNode("foo", location);

    try {
        (node as any).location = createLocation();
        context.assert.fail("location should be readonly.");
    }
    catch {
        context.assert.ok(true, "location is immutable as expected.");
    }
});

test("CodeValueSyntaxNode: value cannot be undefined", (context: TestContext) => {
    const location = createLocation();
    try {
        new TestCodeValueSyntaxNode(undefined as any, location);
        context.assert.fail("Value cannot be undefined.");
    }
    catch {
        context.assert.ok(true, "Undefined value is correctly prevented.");
    }
});