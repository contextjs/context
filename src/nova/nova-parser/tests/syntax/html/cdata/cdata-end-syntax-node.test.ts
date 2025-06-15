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
import { CDATAEndSyntaxNode } from "../../../../src/syntax/html/cdata/cdata-end-syntax-node.js";

const testLocation = new Location(0, 0, 0, 10, "", []);

test('CDATAEndSyntaxNode: should instantiate with value and location', (context: TestContext) => {
    const content = "]]>";
    const node = new CDATAEndSyntaxNode(content, testLocation);

    context.assert.ok(node instanceof CDATAEndSyntaxNode);
    context.assert.ok(node instanceof ValueSyntaxNode);
    context.assert.ok(node instanceof LocationSyntaxNode);
    context.assert.ok(node instanceof SyntaxNode);
    context.assert.strictEqual(node.value, content);
    context.assert.strictEqual(node.location, testLocation);
});

test('CDATAEndSyntaxNode: should accept null value', (context: TestContext) => {
    const node = new CDATAEndSyntaxNode(null, testLocation);

    context.assert.strictEqual(node.value, null);
    context.assert.strictEqual(node.location, testLocation);
});

test('CDATAEndSyntaxNode: should be extensible in the future', (context: TestContext) => {
    class ExtendedCDATAEnd extends CDATAEndSyntaxNode { public extra: string = "extra"; }
    const node = new ExtendedCDATAEnd("]]>", testLocation);

    context.assert.strictEqual(node.value, "]]>");
    context.assert.strictEqual(node.extra, "extra");
    context.assert.strictEqual(node.location, testLocation);
});

test('CDATAEndSyntaxNode: value cannot be reassigned', (context: TestContext) => {
    const content = "]]>";
    const node = new CDATAEndSyntaxNode(content, testLocation);

    try {
        (node as any).value = "new value";
        context.assert.fail("Value should be immutable.");
    }
    catch {
        context.assert.ok(true, "Value is immutable as expected.");
    }
});

test('CDATAEndSyntaxNode: location cannot be reassigned', (context: TestContext) => {
    const node = new CDATAEndSyntaxNode("]]>", testLocation);

    try {
        (node as any).location = new Location(0, 0, 0, 20, "new location", []);
        context.assert.fail("Location should be immutable.");
    }
    catch {
        context.assert.ok(true, "Location is immutable as expected.");
    }
});

test('CDATAEndSyntaxNode: value cannot be undefined', (context: TestContext) => {
    try {
        new CDATAEndSyntaxNode(undefined as any, testLocation);
        context.assert.fail("Value cannot be undefined.");
    }
    catch {
        context.assert.ok(true, "Undefined value is correctly prevented.");
    }
});

test('CDATAEndSyntaxNode: trivia is null by default', (context: TestContext) => {
    const node = new CDATAEndSyntaxNode("]]>", testLocation);

    context.assert.strictEqual(node.trivia, null);
});

test('CDATAEndSyntaxNode: trivia can be assigned', (context: TestContext) => {
    const trivia = new TriviaSyntaxNode("", testLocation);
    const node = new CDATAEndSyntaxNode("]]>", testLocation, trivia);

    context.assert.strictEqual(node.trivia, trivia);
});

test('CDATAEndSyntaxNode: trivia cannot be reassigned', (context: TestContext) => {
    const trivia = new TriviaSyntaxNode("", testLocation);
    const node = new CDATAEndSyntaxNode("]]>", testLocation, trivia);

    try {
        (node as any).trivia = null;
        context.assert.fail("Trivia should be immutable.");
    }
    catch {
        context.assert.ok(true, "Trivia is immutable.");
    }
});

test('CDATAEndSyntaxNode: should accept empty string value', (context: TestContext) => {
    const node = new CDATAEndSyntaxNode("", testLocation);

    context.assert.strictEqual(node.value, "");
    context.assert.strictEqual(node.location, testLocation);
    context.assert.strictEqual(node.trivia, null);
});