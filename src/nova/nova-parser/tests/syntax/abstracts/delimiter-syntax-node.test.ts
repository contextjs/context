/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { Location } from "../../../src/sources/location.js";
import { DelimiterSyntaxNode } from "../../../src/syntax/abstracts/delimiter-syntax-node.js";
import { TriviaSyntaxNode } from "../../../src/syntax/common/trivia-syntax-node.js";

class TestDelimiterSyntaxNode extends DelimiterSyntaxNode { }

function createLocation(): Location {
    return new Location(1, 2, 3, 4, "foo", []);
}

test("DelimiterSyntaxNode: stores delimiter and location, initializes trivia", (context: TestContext) => {
    const location = createLocation();
    const node = new TestDelimiterSyntaxNode("bar", location);

    context.assert.strictEqual(node.value, "bar");
    context.assert.strictEqual(node.location, location);
    context.assert.strictEqual(node.trivia, null);
});

test("DelimiterSyntaxNode: accepts null delimiter", (context: TestContext) => {
    const location = createLocation();
    const node = new TestDelimiterSyntaxNode(null, location);

    context.assert.strictEqual(node.value, null);
});

test("DelimiterSyntaxNode: stores trivia when provided", (context: TestContext) => {
    const location = createLocation();
    const trivia = new TriviaSyntaxNode("trivia", location);
    const node = new TestDelimiterSyntaxNode("bar", location, trivia);

    context.assert.strictEqual(node.trivia, trivia);
});

test("DelimiterSyntaxNode: delimiter cannot be reassigned", (context: TestContext) => {
    const location = createLocation();
    const node = new TestDelimiterSyntaxNode("bar", location);

    try {
        (node as any).value = "new delimiter";
        context.assert.fail("Delimiter should be immutable.");
    }
    catch {
        context.assert.ok(true, "Delimiter is immutable as expected.");
    }
});

test("DelimiterSyntaxNode: delimiter cannot be undefined", (context: TestContext) => {
    const location = createLocation();
    try {
        new TestDelimiterSyntaxNode(undefined as any, location);
        context.assert.fail("Delimiter cannot be undefined.");
    }
    catch {
        context.assert.ok(true, "Undefined delimiter is correctly prevented.");
    }
});

test("DelimiterSyntaxNode: location cannot be reassigned", (context: TestContext) => {
    const location = createLocation();
    const node = new TestDelimiterSyntaxNode("bar", location);

    try {
        (node as any).location = createLocation();
        context.assert.fail("Location should be immutable.");
    }
    catch {
        context.assert.ok(true, "Location is immutable as expected.");
    }
});