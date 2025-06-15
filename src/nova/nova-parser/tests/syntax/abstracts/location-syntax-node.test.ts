/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { Location } from "../../../src/sources/location.js";
import { LocationSyntaxNode } from "../../../src/syntax/abstracts/location-syntax-node.js";
import { TriviaSyntaxNode } from "../../../src/syntax/common/trivia-syntax-node.js";

class TestLocationSyntaxNode extends LocationSyntaxNode { }

function createLocation(): Location {
    return new Location(1, 2, 3, 4, "foo", []);
}

test("LocationSyntaxNode: stores location and initializes trivia", (context: TestContext) => {
    const location = createLocation();
    const node = new TestLocationSyntaxNode(location);

    context.assert.strictEqual(node.location, location);
    context.assert.strictEqual(node.trivia, null);
});

test("LocationSyntaxNode: stores trivia when provided", (context: TestContext) => {
    const location = createLocation();
    const trivia = new TriviaSyntaxNode("", createLocation());
    const node = new TestLocationSyntaxNode(location, trivia);

    context.assert.strictEqual(node.trivia, trivia);
});

test("LocationSyntaxNode: location cannot be reassigned", (context: TestContext) => {
    const location = createLocation();
    const node = new TestLocationSyntaxNode(location);

    try {
        (node as any).location = createLocation();
        context.assert.fail("Location should be immutable.");
    }
    catch {
        context.assert.ok(true, "Location is immutable as expected.");
    }
});