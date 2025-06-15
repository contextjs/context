/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { Location } from "../../../src/sources/location.js";
import { LiteralSyntaxNode } from "../../../src/syntax/common/literal-syntax-node.js";
import { TriviaSyntaxNode } from "../../../src/syntax/common/trivia-syntax-node.js";

function createLocation(): Location {
    return new Location(0, 0, 0, 3, "abc", []);
}

test("LiteralSyntaxNode: inherits from ValueSyntaxNode and stores value/location", (context: TestContext) => {
    const location = createLocation();
    const node = new LiteralSyntaxNode("abc", location);

    context.assert.strictEqual(node.value, "abc");
    context.assert.strictEqual(node.location, location);
    context.assert.strictEqual(node.trivia, null);
});

test("LiteralSyntaxNode: allows null value", (context: TestContext) => {
    const location = createLocation();
    const node = new LiteralSyntaxNode(null, location);

    context.assert.strictEqual(node.value, null);
    context.assert.strictEqual(node.location, location);
});

test("LiteralSyntaxNode: value cannot be reassigned", (context: TestContext) => {
    const location = createLocation();
    const node = new LiteralSyntaxNode("abc", location);

    try {
        (node as any).value = "new value";
        context.assert.fail("Value should be immutable.");
    }
    catch {
        context.assert.ok(true, "Value is immutable as expected.");
    }
});

test("LiteralSyntaxNode: location cannot be reassigned", (context: TestContext) => {
    const location = createLocation();
    const node = new LiteralSyntaxNode("abc", location);

    try {
        (node as any).location = createLocation();
        context.assert.fail("Location should be immutable.");
    }
    catch {
        context.assert.ok(true, "Location is immutable as expected.");
    }
});

test("LiteralSyntaxNode: trivia can be assigned", (context: TestContext) => {
    const location = createLocation();
    const trivia = new TriviaSyntaxNode("", location);
    const node = new LiteralSyntaxNode("abc", location, trivia);

    context.assert.strictEqual(node.trivia, trivia);
});

test("LiteralSyntaxNode: value cannot be undefined", (context: TestContext) => {
    const location = createLocation();
    try {
        new LiteralSyntaxNode(undefined!, location);
        context.assert.fail("Value cannot be undefined.");
    }
    catch {
        context.assert.ok(true, "Undefined value is correctly prevented.");
    }
});

test("LiteralSyntaxNode: allows empty string value", (context: TestContext) => {
    const location = createLocation();
    const node = new LiteralSyntaxNode("", location);

    context.assert.strictEqual(node.value, "");
});

test("LiteralSyntaxNode: is extensible via subclass", (context: TestContext) => {
    class ExtendedLiteral extends LiteralSyntaxNode { public extra = 42; }
    const node = new ExtendedLiteral("abc", createLocation());

    context.assert.strictEqual(node.extra, 42);
});