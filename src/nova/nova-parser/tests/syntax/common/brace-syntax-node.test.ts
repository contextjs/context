/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { Location } from "../../../src/sources/location.js";
import { BraceSyntaxNode } from "../../../src/syntax/common/brace-syntax-node.js";
import { TriviaSyntaxNode } from "../../../src/syntax/common/trivia-syntax-node.js";

function createLocation(): Location {
    return new Location(1, 2, 3, 4, "foo", []);
}

test("BraceSyntaxNode: stores value and location, initializes trivia", (context: TestContext) => {
    const location = createLocation();
    const node = new BraceSyntaxNode("{", location);

    context.assert.strictEqual(node.value, "{");
    context.assert.strictEqual(node.location, location);
    context.assert.strictEqual(node.trivia, null);
});

test("BraceSyntaxNode: accepts null value", (context: TestContext) => {
    const location = createLocation();
    const node = new BraceSyntaxNode(null, location);

    context.assert.strictEqual(node.value, null);
});

test("BraceSyntaxNode: stores trivia when provided", (context: TestContext) => {
    const location = createLocation();
    const trivia = new TriviaSyntaxNode("trivia", location);
    const node = new BraceSyntaxNode("}", location, trivia);

    context.assert.strictEqual(node.trivia, trivia);
});

test("BraceSyntaxNode: value cannot be reassigned", (context: TestContext) => {
    const location = createLocation();
    const node = new BraceSyntaxNode("{", location);

    try {
        (node as any).value = "[";
        context.assert.fail("Brace value should be immutable.");
    }
    catch {
        context.assert.ok(true, "Brace value is immutable as expected.");
    }
});

test("BraceSyntaxNode: value cannot be undefined", (context: TestContext) => {
    const location = createLocation();
    
    try {
        new BraceSyntaxNode(undefined as any, location);
        context.assert.fail("Brace value cannot be undefined.");
    }
    catch {
        context.assert.ok(true, "Undefined value is correctly prevented.");
    }
});

test("BraceSyntaxNode: location cannot be reassigned", (context: TestContext) => {
    const location = createLocation();
    const node = new BraceSyntaxNode("{", location);

    try {
        (node as any).location = createLocation();
        context.assert.fail("Location should be immutable.");
    }
    catch {
        context.assert.ok(true, "Location is immutable as expected.");
    }
});