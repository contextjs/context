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
import { SyntaxNode } from "../../../src/syntax/abstracts/syntax-node.js";
import { ValueSyntaxNode } from "../../../src/syntax/abstracts/value-syntax-node.js";
import { CommentSyntaxNode } from "../../../src/syntax/common/comment-syntax-node.js";
import { TriviaSyntaxNode } from "../../../src/syntax/common/trivia-syntax-node.js";

const testLocation = new Location(0, 0, 0, 10, "", []);

test('CommentSyntaxNode: instantiates with value and location, trivia defaults to null', (context: TestContext) => {
    const content = "// a comment";
    const node = new CommentSyntaxNode(content, testLocation);

    context.assert.ok(node instanceof CommentSyntaxNode);
    context.assert.ok(node instanceof ValueSyntaxNode);
    context.assert.ok(node instanceof LocationSyntaxNode);
    context.assert.ok(node instanceof SyntaxNode);
    context.assert.strictEqual(node.value, content);
    context.assert.deepStrictEqual(node.location, testLocation);
    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test('CommentSyntaxNode: accepts null value', (context: TestContext) => {
    const node = new CommentSyntaxNode(null, testLocation);

    context.assert.strictEqual(node.value, null);
    context.assert.deepStrictEqual(node.location, testLocation);
});

test('CommentSyntaxNode: accepts empty string value', (context: TestContext) => {
    const node = new CommentSyntaxNode("", testLocation);

    context.assert.strictEqual(node.value, "");
    context.assert.deepStrictEqual(node.location, testLocation);
    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test('CommentSyntaxNode: can be subclassed', (context: TestContext) => {
    class ExtendedComment extends CommentSyntaxNode { public kind = "ts"; }
    const node = new ExtendedComment("// TODO", testLocation);

    context.assert.strictEqual(node.value, "// TODO");
    context.assert.strictEqual(node.kind, "ts");
    context.assert.deepStrictEqual(node.location, testLocation);
});

test('CommentSyntaxNode: sets leading trivia when provided', (context: TestContext) => {
    const leading = new TriviaSyntaxNode("lead", testLocation);
    const node = new CommentSyntaxNode("// a comment", testLocation, leading);

    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test('CommentSyntaxNode: sets trailing trivia when provided', (context: TestContext) => {
    const trailing = new TriviaSyntaxNode("trail", testLocation);
    const node = new CommentSyntaxNode("// a comment", testLocation, null, trailing);

    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});

test('CommentSyntaxNode: sets both leading and trailing trivia when provided', (context: TestContext) => {
    const leading = new TriviaSyntaxNode("lead", testLocation);
    const trailing = new TriviaSyntaxNode("trail", testLocation);
    const node = new CommentSyntaxNode("// a comment", testLocation, leading, trailing);

    context.assert.strictEqual(node.leadingTrivia, leading);
    context.assert.strictEqual(node.trailingTrivia, trailing);
});