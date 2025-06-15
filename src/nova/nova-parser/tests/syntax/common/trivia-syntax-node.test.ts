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

function createLocation(): Location {
    return new Location(0, 0, 0, 5, "     ", []);
}

test("TriviaSyntaxNode: inherits from ValueSyntaxNode and stores value/location", (context: TestContext) => {
    const location = createLocation();
    const node = new TriviaSyntaxNode("     ", location);

    context.assert.strictEqual(node.value, "     ");
    context.assert.strictEqual(node.location, location);
    context.assert.strictEqual(node.trivia, null);
});

test("TriviaSyntaxNode: allows null value", (context: TestContext) => {
    const location = createLocation();
    const node = new TriviaSyntaxNode(null, location);

    context.assert.strictEqual(node.value, null);
    context.assert.strictEqual(node.location, location);
});

test("TriviaSyntaxNode: value cannot be reassigned", (context: TestContext) => {
    const location = createLocation();
    const node = new TriviaSyntaxNode("\t  ", location);

    try {
        (node as any).value = "new value";
        context.assert.fail("Value should be immutable.");
    }
    catch {
        context.assert.ok(true, "Value is immutable as expected.");
    }
});

test("TriviaSyntaxNode: location cannot be reassigned", (context: TestContext) => {
    const location = createLocation();
    const node = new TriviaSyntaxNode("\n", location);

    try {
        (node as any).location = createLocation();
        context.assert.fail("Location should be immutable.");
    }
    catch {
        context.assert.ok(true, "Location is immutable as expected.");
    }
});

test("TriviaSyntaxNode: value cannot be undefined", (context: TestContext) => {
    const location = createLocation();

    try {
        new TriviaSyntaxNode(undefined!, location);
        context.assert.fail("Value cannot be undefined.");
    }
    catch {
        context.assert.ok(true, "Undefined value is correctly prevented.");
    }
});

test("TriviaSyntaxNode: supports tabs and newlines as value", (context: TestContext) => {
    const location = createLocation();
    const node = new TriviaSyntaxNode("\t\n  ", location);

    context.assert.strictEqual(node.value, "\t\n  ");
});

test("TriviaSyntaxNode: allows empty string as value", (context: TestContext) => {
    const location = createLocation();
    const node = new TriviaSyntaxNode("", location);

    context.assert.strictEqual(node.value, "");
});