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

test("CDATAContentSyntaxNode: OOP - is correct type", (context: TestContext) => {
    const node = new CDATAContentSyntaxNode("foo", testLocation);

    context.assert.ok(node instanceof CDATAContentSyntaxNode);
    context.assert.ok(node instanceof ValueSyntaxNode);
    context.assert.ok(node instanceof LocationSyntaxNode);
    context.assert.ok(node instanceof SyntaxNode);
});

test("CDATAContentSyntaxNode: stores value, location, and trivia defaults to null", (context: TestContext) => {
    const content = "some <xml> & weird stuff";
    const node = new CDATAContentSyntaxNode(content, testLocation);

    context.assert.strictEqual(node.value, content);
    context.assert.strictEqual(node.location, testLocation);
    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("CDATAContentSyntaxNode: allows null value", (context: TestContext) => {
    const node = new CDATAContentSyntaxNode(null, testLocation);

    context.assert.strictEqual(node.value, null);
    context.assert.strictEqual(node.location, testLocation);
});

test("CDATAContentSyntaxNode: supports leading trivia", (context: TestContext) => {
    const leading = new TriviaSyntaxNode("lead", testLocation);
    const node = new CDATAContentSyntaxNode("foo", testLocation, leading);

    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("CDATAContentSyntaxNode: supports trailing trivia", (context: TestContext) => {
    const trailing = new TriviaSyntaxNode("trail", testLocation);
    const node = new CDATAContentSyntaxNode("foo", testLocation, null, trailing);

    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("CDATAContentSyntaxNode: supports both leading and trailing trivia", (context: TestContext) => {
    const leading = new TriviaSyntaxNode("lead", testLocation);
    const trailing = new TriviaSyntaxNode("trail", testLocation);
    const node = new CDATAContentSyntaxNode("foo", testLocation, leading, trailing);

    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("CDATAContentSyntaxNode: allows empty string value", (context: TestContext) => {
    const node = new CDATAContentSyntaxNode("", testLocation);

    context.assert.strictEqual(node.value, "");
    context.assert.strictEqual(node.location, testLocation);
});

test("CDATAContentSyntaxNode: can be subclassed", (context: TestContext) => {
    class ExtendedCDATA extends CDATAContentSyntaxNode { public extra = "extra"; }
    const node = new ExtendedCDATA("data", testLocation);

    context.assert.strictEqual(node.value, "data");
    context.assert.strictEqual(node.extra, "extra");
    context.assert.strictEqual(node.location, testLocation);
});