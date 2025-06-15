/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { SyntaxNode } from "../../../../src/syntax/abstracts/syntax-node.js";
import { CDATASyntaxNode } from "../../../../src/syntax/html/cdata/cdata-syntax-node.js";
import { TriviaSyntaxNode } from "../../../../src/syntax/common/trivia-syntax-node.js";

class TestNode extends SyntaxNode { }
const testStart = new TestNode();
const testContent = new TestNode();
const testEnd = new TestNode();
const testTrivia = new TriviaSyntaxNode("test trivia", null!);

test('CDATASyntaxNode: constructs with start, content, end, and trivia', (context: TestContext) => {
    const node = new CDATASyntaxNode(testStart, testContent, testEnd, testTrivia);

    context.assert.ok(node instanceof CDATASyntaxNode);
    context.assert.strictEqual(node.start, testStart);
    context.assert.strictEqual(node.content, testContent);
    context.assert.strictEqual(node.end, testEnd);
    context.assert.strictEqual(node.trivia, testTrivia);
});

test('CDATASyntaxNode: trivia defaults to null', (context: TestContext) => {
    const node = new CDATASyntaxNode(testStart, testContent, testEnd);

    context.assert.strictEqual(node.trivia, null);
});

test('CDATASyntaxNode: is extensible via subclass', (context: TestContext) => {
    class ExtendedCDATASyntaxNode extends CDATASyntaxNode { public extra = "extension"; }
    const node = new ExtendedCDATASyntaxNode(testStart, testContent, testEnd);

    context.assert.ok(node instanceof CDATASyntaxNode);
    context.assert.strictEqual(node.extra, "extension");
});

test('CDATASyntaxNode: start/content/end cannot be reassigned', (context: TestContext) => {
    const node = new CDATASyntaxNode(testStart, testContent, testEnd);

    try {
        (node as any).start = new TestNode();
        context.assert.fail("Start should be immutable.");
    }
    catch {
        context.assert.ok(true, "Start is immutable as expected.");
    }

    try {
        (node as any).content = new TestNode();
        context.assert.fail("Content should be immutable.");
    }
    catch {
        context.assert.ok(true, "Content is immutable as expected.");
    }

    try {
        (node as any).end = new TestNode();
        context.assert.fail("End should be immutable.");
    }
    catch {
        context.assert.ok(true, "End is immutable as expected.");
    }
});

test('CDATASyntaxNode: trivia cannot be reassigned', (context: TestContext) => {
    const node = new CDATASyntaxNode(testStart, testContent, testEnd, testTrivia);

    try {
        (node as any).trivia = null;
        context.assert.fail("Trivia should be immutable.");
    }
    catch {
        context.assert.ok(true, "Trivia is immutable as expected.");
    }
});

test('CDATASyntaxNode: does not accept undefined for children', (context: TestContext) => {
    try {
        new CDATASyntaxNode(undefined as any, testContent, testEnd);
        context.assert.fail("Start cannot be undefined.");
    }
    catch {
        context.assert.ok(true);
    }

    try {
        new CDATASyntaxNode(testStart, undefined as any, testEnd);
        context.assert.fail("Content cannot be undefined.");
    }
    catch {
        context.assert.ok(true);
    }
    
    try {
        new CDATASyntaxNode(testStart, testContent, undefined as any);
        context.assert.fail("End cannot be undefined.");
    }
    catch {
        context.assert.ok(true);
    }
});