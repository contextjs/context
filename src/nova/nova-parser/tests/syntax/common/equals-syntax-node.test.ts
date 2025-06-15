/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { Location } from "../../../src/sources/location.js";
import { EqualsSyntaxNode } from "../../../src/syntax/common/equals-syntax-node.js";
import { TriviaSyntaxNode } from "../../../src/syntax/common/trivia-syntax-node.js";

function createLocation(): Location {
    return new Location(1, 2, 3, 4, "foo", []);
}

test("EqualsSyntaxNode: stores value and location, initializes trivia", (context: TestContext) => {
    const location = createLocation();
    const node = new EqualsSyntaxNode("=", location);

    context.assert.strictEqual(node.value, "=");
    context.assert.strictEqual(node.location, location);
    context.assert.strictEqual(node.trivia, null);
});

test("EqualsSyntaxNode: accepts null value", (context: TestContext) => {
    const location = createLocation();
    const node = new EqualsSyntaxNode(null, location);

    context.assert.strictEqual(node.value, null);
});

test("EqualsSyntaxNode: stores trivia when provided", (context: TestContext) => {
    const location = createLocation();
    const trivia = new TriviaSyntaxNode("trivia", location);
    const node = new EqualsSyntaxNode("=", location, trivia);

    context.assert.strictEqual(node.trivia, trivia);
});

test("EqualsSyntaxNode: value cannot be reassigned", (context: TestContext) => {
    const location = createLocation();
    const node = new EqualsSyntaxNode("=", location);

    try {
        (node as any).value = "!=";
        context.assert.fail("Equals value should be immutable.");
    }
    catch {
        context.assert.ok(true, "Equals value is immutable as expected.");
    }
});

test("EqualsSyntaxNode: value cannot be undefined", (context: TestContext) => {
    const location = createLocation();
    try {
        new EqualsSyntaxNode(undefined as any, location);
        context.assert.fail("Equals value cannot be undefined.");
    }
    catch {
        context.assert.ok(true, "Undefined value is correctly prevented.");
    }
});

test("EqualsSyntaxNode: location cannot be reassigned", (context: TestContext) => {
    const location = createLocation();
    const node = new EqualsSyntaxNode("=", location);

    try {
        (node as any).location = createLocation();
        context.assert.fail("Location should be immutable.");
    }
    catch {
        context.assert.ok(true, "Location is immutable as expected.");
    }
});