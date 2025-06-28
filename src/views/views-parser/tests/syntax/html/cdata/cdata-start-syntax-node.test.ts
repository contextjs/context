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
import { CDATAStartSyntaxNode } from "../../../../src/syntax/html/cdata/cdata-start-syntax-node.js";

const testLocation = new Location(0, 0, 0, 10, "", []);

test("CDATAStartSyntaxNode: OOP - is correct type", (context: TestContext) => {
    const node = new CDATAStartSyntaxNode("<![CDATA[", testLocation);

    context.assert.ok(node instanceof CDATAStartSyntaxNode);
    context.assert.ok(node instanceof ValueSyntaxNode);
    context.assert.ok(node instanceof LocationSyntaxNode);
    context.assert.ok(node instanceof SyntaxNode);
});

test("CDATAStartSyntaxNode: stores value, location, trivia defaults to null", (context: TestContext) => {
    const content = "<![CDATA[";
    const node = new CDATAStartSyntaxNode(content, testLocation);

    context.assert.strictEqual(node.value, content);
    context.assert.strictEqual(node.location, testLocation);
    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("CDATAStartSyntaxNode: allows null value", (context: TestContext) => {
    const node = new CDATAStartSyntaxNode(null, testLocation);

    context.assert.strictEqual(node.value, null);
    context.assert.strictEqual(node.location, testLocation);
});

test("CDATAStartSyntaxNode: supports leading trivia", (context: TestContext) => {
    const leading = new TriviaSyntaxNode("lead", testLocation);
    const node = new CDATAStartSyntaxNode("<![CDATA[", testLocation, leading);

    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("CDATAStartSyntaxNode: supports trailing trivia", (context: TestContext) => {
    const trailing = new TriviaSyntaxNode("trail", testLocation);
    const node = new CDATAStartSyntaxNode("<![CDATA[", testLocation, null, trailing);

    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("CDATAStartSyntaxNode: supports both leading and trailing trivia", (context: TestContext) => {
    const leading = new TriviaSyntaxNode("lead", testLocation);
    const trailing = new TriviaSyntaxNode("trail", testLocation);
    const node = new CDATAStartSyntaxNode("<![CDATA[", testLocation, leading, trailing);

    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test("CDATAStartSyntaxNode: allows empty string value", (context: TestContext) => {
    const node = new CDATAStartSyntaxNode("", testLocation);

    context.assert.strictEqual(node.value, "");
    context.assert.strictEqual(node.location, testLocation);
});

test("CDATAStartSyntaxNode: can be subclassed", (context: TestContext) => {
    class ExtendedCDATAStart extends CDATAStartSyntaxNode { public extra: string = "extra"; }
    const node = new ExtendedCDATAStart("<![CDATA[", testLocation);

    context.assert.strictEqual(node.value, "<![CDATA[");
    context.assert.strictEqual(node.extra, "extra");
    context.assert.strictEqual(node.location, testLocation);
});