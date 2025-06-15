/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { Location } from "../../../src/sources/location.js";
import { ValueSyntaxNode } from "../../../src/syntax/abstracts/value-syntax-node.js";
import { TriviaSyntaxNode } from "../../../src/syntax/common/trivia-syntax-node.js";

class TestValueSyntaxNode extends ValueSyntaxNode { }

function createLocation(): Location {
    return new Location(1, 2, 3, 4, "foo", []);
}

test("ValueSyntaxNode: stores value and location, initializes trivia", (context: TestContext) => {
    const location = createLocation();
    const node = new TestValueSyntaxNode("bar", location);

    context.assert.strictEqual(node.value, "bar");
    context.assert.strictEqual(node.location, location);
    context.assert.strictEqual(node.trivia, null);
});

test("ValueSyntaxNode: accepts null value", (context: TestContext) => {
    const location = createLocation();
    const node = new TestValueSyntaxNode(null, location);

    context.assert.strictEqual(node.value, null);
});

test("ValueSyntaxNode: stores trivia when provided", (context: TestContext) => {
    const location = createLocation();
    const trivia = new TriviaSyntaxNode("trivia", location);
    const node = new TestValueSyntaxNode("bar", location, trivia);

    context.assert.strictEqual(node.trivia, trivia);
});

test("ValueSyntaxNode: value cannot be reassigned", (context: TestContext) => {
    const location = createLocation();
    const node = new TestValueSyntaxNode("bar", location);

    try {
        (node as any).value = "new value";
        context.assert.fail("Value should be immutable.");
    }
    catch {
        context.assert.ok(true, "Value is immutable as expected.");
    }
});

test("ValueSyntaxNode: value cannot be undefined", (context: TestContext) => {
    const location = createLocation();
    try {
        const node = new TestValueSyntaxNode(undefined as any, location);
        context.assert.fail("Value cannot be undefined.");
    }
    catch {
        context.assert.ok(true, "Undefined value is correctly prevented.");
    }
});

test("ValueSyntaxNode: location cannot be reassigned", (context: TestContext) => {
    const location = createLocation();
    const node = new TestValueSyntaxNode("bar", location);

    try {
        (node as any).location = createLocation();
        context.assert.fail("Location should be immutable.");
    }
    catch {
        context.assert.ok(true, "Location is immutable as expected.");
    }
});