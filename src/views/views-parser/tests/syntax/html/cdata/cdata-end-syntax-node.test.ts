/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Location } from "@contextjs/views";
import test, { TestContext } from "node:test";
import { LocationSyntaxNode } from "../../../../src/syntax/abstracts/location-syntax-node.js";
import { SyntaxNode } from "../../../../src/syntax/abstracts/syntax-node.js";
import { ValueSyntaxNode } from "../../../../src/syntax/abstracts/value-syntax-node.js";
import { TriviaSyntaxNode } from "../../../../src/syntax/common/trivia-syntax-node.js";
import { CDATAEndSyntaxNode } from "../../../../src/syntax/html/cdata/cdata-end-syntax-node.js";

const testLocation = new Location(0, 0, 0, 10, "", []);

test("CDATAEndSyntaxNode: OOP - is correct type", (context: TestContext) => {
    const node = new CDATAEndSyntaxNode("]]>", testLocation);

    context.assert.ok(node instanceof CDATAEndSyntaxNode);
    context.assert.ok(node instanceof ValueSyntaxNode);
    context.assert.ok(node instanceof LocationSyntaxNode);
    context.assert.ok(node instanceof SyntaxNode);
});

test("CDATAEndSyntaxNode: stores value, location, trivia defaults to null", (context: TestContext) => {
    const content = "]]>";
    const node = new CDATAEndSyntaxNode(content, testLocation);

    context.assert.strictEqual(node.value, content);
    context.assert.strictEqual(node.location, testLocation);
    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("CDATAEndSyntaxNode: allows null value", (context: TestContext) => {
    const node = new CDATAEndSyntaxNode(null, testLocation);

    context.assert.strictEqual(node.value, null);
    context.assert.strictEqual(node.location, testLocation);
});

test("CDATAEndSyntaxNode: supports leading trivia", (context: TestContext) => {
    const leading = new TriviaSyntaxNode("lead", testLocation);
    const node = new CDATAEndSyntaxNode("]]>", testLocation, leading);

    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("CDATAEndSyntaxNode: supports trailing trivia", (context: TestContext) => {
    const trailing = new TriviaSyntaxNode("trail", testLocation);
    const node = new CDATAEndSyntaxNode("]]>", testLocation, null, trailing);

    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("CDATAEndSyntaxNode: supports both leading and trailing trivia", (context: TestContext) => {
    const leading = new TriviaSyntaxNode("lead", testLocation);
    const trailing = new TriviaSyntaxNode("trail", testLocation);
    const node = new CDATAEndSyntaxNode("]]>", testLocation, leading, trailing);

    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("CDATAEndSyntaxNode: allows empty string value", (context: TestContext) => {
    const node = new CDATAEndSyntaxNode("", testLocation);

    context.assert.strictEqual(node.value, "");
    context.assert.strictEqual(node.location, testLocation);
});

test("CDATAEndSyntaxNode: can be subclassed", (context: TestContext) => {
    class ExtendedCDATAEnd extends CDATAEndSyntaxNode { public extra: string = "extra"; }
    const node = new ExtendedCDATAEnd("]]>", testLocation);

    context.assert.strictEqual(node.value, "]]>");
    context.assert.strictEqual(node.extra, "extra");
    context.assert.strictEqual(node.location, testLocation);
});