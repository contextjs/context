/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { Location } from "../../../src/sources/location.js";
import { QuoteSyntaxNode } from "../../../src/syntax/common/quote-syntax-node.js";
import { TriviaSyntaxNode } from "../../../src/syntax/common/trivia-syntax-node.js";

function createLocation(): Location {
    return new Location(1, 2, 3, 4, "foo", []);
}

test("QuoteSyntaxNode: stores value and location, initializes trivia", (context: TestContext) => {
    const location = createLocation();
    const node = new QuoteSyntaxNode("{", location);

    context.assert.strictEqual(node.value, "{");
    context.assert.strictEqual(node.location, location);
    context.assert.strictEqual(node.trivia, null);
});

test("QuoteSyntaxNode: accepts null value", (context: TestContext) => {
    const location = createLocation();
    const node = new QuoteSyntaxNode(null, location);

    context.assert.strictEqual(node.value, null);
});

test("QuoteSyntaxNode: stores trivia when provided", (context: TestContext) => {
    const location = createLocation();
    const trivia = new TriviaSyntaxNode("trivia", location);
    const node = new QuoteSyntaxNode("}", location, trivia);

    context.assert.strictEqual(node.trivia, trivia);
});

test("QuoteSyntaxNode: value cannot be reassigned", (context: TestContext) => {
    const location = createLocation();
    const node = new QuoteSyntaxNode("{", location);

    try {
        (node as any).value = "[";
        context.assert.fail("Quote value should be immutable.");
    }
    catch {
        context.assert.ok(true, "Quote value is immutable as expected.");
    }
});

test("QuoteSyntaxNode: value cannot be undefined", (context: TestContext) => {
    const location = createLocation();
    try {
        new QuoteSyntaxNode(undefined as any, location);
        context.assert.fail("Quote value cannot be undefined.");
    }
    catch {
        context.assert.ok(true, "Undefined value is correctly prevented.");
    }
});

test("QuoteSyntaxNode: location cannot be reassigned", (context: TestContext) => {
    const location = createLocation();
    const node = new QuoteSyntaxNode("{", location);

    try {
        (node as any).location = createLocation();
        context.assert.fail("Location should be immutable.");
    }
    catch {
        context.assert.ok(true, "Location is immutable as expected.");
    }
});