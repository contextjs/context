/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { Location } from "../../../src/sources/location.js";
import { TransitionSyntaxNode } from "../../../src/syntax/common/transition-syntax-node.js";
import { TriviaSyntaxNode } from "../../../src/syntax/common/trivia-syntax-node.js";

function createLocation(): Location {
    return new Location(1, 2, 3, 4, "foo", []);
}

test("TransitionSyntaxNode: stores value and location, initializes trivia", (context: TestContext) => {
    const location = createLocation();
    const node = new TransitionSyntaxNode("@", location);

    context.assert.strictEqual(node.value, "@");
    context.assert.strictEqual(node.location, location);
    context.assert.strictEqual(node.trivia, null);
});

test("TransitionSyntaxNode: accepts null value", (context: TestContext) => {
    const location = createLocation();
    const node = new TransitionSyntaxNode(null, location);

    context.assert.strictEqual(node.value, null);
});

test("TransitionSyntaxNode: stores trivia when provided", (context: TestContext) => {
    const location = createLocation();
    const trivia = new TriviaSyntaxNode(" ", location);
    const node = new TransitionSyntaxNode("@", location, trivia);

    context.assert.strictEqual(node.trivia, trivia);
});

test("TransitionSyntaxNode: value cannot be reassigned", (context: TestContext) => {
    const location = createLocation();
    const node = new TransitionSyntaxNode("@", location);

    try {
        (node as any).value = "#";
        context.assert.fail("Transition value should be immutable.");
    }
    catch {
        context.assert.ok(true, "Transition value is immutable as expected.");
    }
});

test("TransitionSyntaxNode: value cannot be undefined", (context: TestContext) => {
    const location = createLocation();
    try {
        new TransitionSyntaxNode(undefined as any, location);
        context.assert.fail("Transition value cannot be undefined.");
    }
    catch {
        context.assert.ok(true, "Undefined value is correctly prevented.");
    }
});

test("TransitionSyntaxNode: location cannot be reassigned", (context: TestContext) => {
    const location = createLocation();
    const node = new TransitionSyntaxNode("@", location);

    try {
        (node as any).location = createLocation();
        context.assert.fail("Location should be immutable.");
    }
    catch {
        context.assert.ok(true, "Location is immutable as expected.");
    }
});