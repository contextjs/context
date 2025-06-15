/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { Location } from "../../../../src/sources/location.js";
import { LocationSyntaxNode } from "../../../../src/syntax/abstracts/location-syntax-node.js";
import { SyntaxNode } from "../../../../src/syntax/abstracts/syntax-node.js";
import { ValueSyntaxNode } from "../../../../src/syntax/abstracts/value-syntax-node.js";
import { TriviaSyntaxNode } from "../../../../src/syntax/common/trivia-syntax-node.js";
import { CDATAContentSyntaxNode } from "../../../../src/syntax/html/cdata/cdata-content-syntax-node.js";

const testLocation = new Location(0, 0, 0, 10, "", []);

test('CDATAContentSyntaxNode: should instantiate with value and location', (context: TestContext) => {
    const content = "some <xml> & weird stuff";
    const node = new CDATAContentSyntaxNode(content, testLocation);

    context.assert.ok(node instanceof CDATAContentSyntaxNode);
    context.assert.ok(node instanceof ValueSyntaxNode);
    context.assert.ok(node instanceof LocationSyntaxNode);
    context.assert.ok(node instanceof SyntaxNode);
    context.assert.strictEqual(node.value, content);
    context.assert.strictEqual(node.location, testLocation);
});

test('CDATAContentSyntaxNode: should accept null value', (context: TestContext) => {
    const node = new CDATAContentSyntaxNode(null, testLocation);

    context.assert.strictEqual(node.value, null);
    context.assert.strictEqual(node.location, testLocation);
});

test('CDATAContentSyntaxNode: should be extensible in the future', (context: TestContext) => {
    class ExtendedCDATA extends CDATAContentSyntaxNode { public extra: string = "extra"; }
    const node = new ExtendedCDATA("data", testLocation);

    context.assert.strictEqual(node.value, "data");
    context.assert.strictEqual(node.extra, "extra");
    context.assert.strictEqual(node.location, testLocation);
});

test('CDATAContentSyntaxNode: value cannot be reassigned', (context: TestContext) => {
    const content = "some <xml> & weird stuff";
    const node = new CDATAContentSyntaxNode(content, testLocation);

    try {
        (node as any).value = "new value";
        context.assert.fail("Value should be immutable.");
    }
    catch {
        context.assert.ok(true, "Value is immutable as expected.");
    }
});

test('CDATAContentSyntaxNode: location cannot be reassigned', (context: TestContext) => {
    const node = new CDATAContentSyntaxNode("some <xml>", testLocation);

    try {
        (node as any).location = new Location(0, 0, 0, 20, "new location", []);
        context.assert.fail("Location should be immutable.");
    }
    catch {
        context.assert.ok(true, "Location is immutable as expected.");
    }
});

test('CDATAContentSyntaxNode: value cannot be undefined', (context: TestContext) => {
    try {
        const node = new CDATAContentSyntaxNode(undefined as any, testLocation);
        context.assert.fail("Value cannot be undefined.");
    }
    catch {
        context.assert.ok(true, "Undefined value is correctly prevented.");
    }
});

test('CDATAContentSyntaxNode: trivia is null by default', (context: TestContext) => {
    const node = new CDATAContentSyntaxNode("some <xml>", testLocation);

    context.assert.strictEqual(node.trivia, null);
});

test('CDATAContentSyntaxNode: trivia can be assigned', (context: TestContext) => {
    const trivia = new TriviaSyntaxNode("", testLocation);
    const node = new CDATAContentSyntaxNode("some <xml>", testLocation, trivia);

    context.assert.strictEqual(node.trivia, trivia);
});

test('CDATAContentSyntaxNode: trivia cannot be reassigned', (context: TestContext) => {
    const trivia = new TriviaSyntaxNode("", testLocation);
    const node = new CDATAContentSyntaxNode("some <xml>", testLocation, trivia);

    try {
        (node as any).trivia = null;
        context.assert.fail("Trivia should be immutable.");
    }
    catch {
        context.assert.ok(true, "Trivia is immutable.");
    }
});

test('CDATAContentSyntaxNode: should accept empty string value', (context: TestContext) => {
    const node = new CDATAContentSyntaxNode("", testLocation);

    context.assert.strictEqual(node.value, "");
    context.assert.strictEqual(node.location, testLocation);
    context.assert.strictEqual(node.trivia, null);
});
