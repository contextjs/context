/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { SyntaxNode } from "../../../../src/syntax/abstracts/syntax-node.js";
import { TriviaSyntaxNode } from "../../../../src/syntax/common/trivia-syntax-node.js";
import { CDATASyntaxNode } from "../../../../src/syntax/html/cdata/cdata-syntax-node.js";

class TestNode extends SyntaxNode { }
const testStart = new TestNode();
const testContent = new TestNode();
const testEnd = new TestNode();
const leadingTrivia = new TriviaSyntaxNode("leading", null!);
const trailingTrivia = new TriviaSyntaxNode("trailing", null!);

test("CDATASyntaxNode: constructs with start, content, end, trivia (leading/trailing)", (context: TestContext) => {
    const node = new CDATASyntaxNode(testStart, testContent, testEnd, leadingTrivia, trailingTrivia);

    context.assert.ok(node instanceof CDATASyntaxNode);
    context.assert.strictEqual(node.start, testStart);
    context.assert.strictEqual(node.content, testContent);
    context.assert.strictEqual(node.end, testEnd);
    context.assert.strictEqual(node.leadingTrivia, leadingTrivia);
    context.assert.strictEqual(node.trailingTrivia, trailingTrivia);
});

test("CDATASyntaxNode: trivia defaults to null", (context: TestContext) => {
    const node = new CDATASyntaxNode(testStart, testContent, testEnd);

    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("CDATASyntaxNode: supports only leading trivia", (context: TestContext) => {
    const node = new CDATASyntaxNode(testStart, testContent, testEnd, leadingTrivia);

    context.assert.strictEqual(node.leadingTrivia, leadingTrivia);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("CDATASyntaxNode: supports only trailing trivia", (context: TestContext) => {
    const node = new CDATASyntaxNode(testStart, testContent, testEnd, null, trailingTrivia);

    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, trailingTrivia);
});

test("CDATASyntaxNode: is extensible via subclass", (context: TestContext) => {
    class ExtendedCDATASyntaxNode extends CDATASyntaxNode { public extra = "extension"; }
    const node = new ExtendedCDATASyntaxNode(testStart, testContent, testEnd);

    context.assert.ok(node instanceof CDATASyntaxNode);
    context.assert.strictEqual(node.extra, "extension");
});