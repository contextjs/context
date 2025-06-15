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
import { EndOfFileSyntaxNode } from "../../../src/syntax/common/end-of-file-syntax-node.js";

function createLocation(): Location {
    return new Location(0, 0, 0, 0, "", []);
}

test("EndOfFileSyntaxNode: static endOfFile is EOF", (context: TestContext) => {
    context.assert.strictEqual(EndOfFileSyntaxNode.endOfFile, "\0");
});

test("EndOfFileSyntaxNode: endOfFile cannot be reassigned", (context: TestContext) => {
    try {
        (EndOfFileSyntaxNode as any).endOfFile = "new value";
        context.assert.fail("endOfFile should be immutable.");
    }
    catch {
        context.assert.ok(true, "endOfFile is immutable as expected.");
    }
});

test("EndOfFileSyntaxNode: stores location and has trivia null", (context: TestContext) => {
    const location = createLocation();
    const node = new EndOfFileSyntaxNode(location);

    context.assert.strictEqual(node.location, location);
    context.assert.strictEqual(node.trivia, null);
});

test("EndOfFileSyntaxNode: inherits from LocationSyntaxNode", (context: TestContext) => {
    const location = createLocation();
    const node = new EndOfFileSyntaxNode(location);

    context.assert.ok(node instanceof EndOfFileSyntaxNode);
    context.assert.ok(node instanceof LocationSyntaxNode);
});