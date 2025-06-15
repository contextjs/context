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

test('CommentSyntaxNode: should instantiate with value and location', (context: TestContext) => {
    const content = "// a comment";
    const node = new CommentSyntaxNode(content, testLocation);

    context.assert.ok(node instanceof CommentSyntaxNode);
    context.assert.ok(node instanceof ValueSyntaxNode);
    context.assert.ok(node instanceof LocationSyntaxNode);
    context.assert.ok(node instanceof SyntaxNode);
    context.assert.strictEqual(node.value, content);
    context.assert.deepStrictEqual(node.location, testLocation);
});

test('CommentSyntaxNode: should accept null value', (context: TestContext) => {
    const node = new CommentSyntaxNode(null, testLocation);

    context.assert.strictEqual(node.value, null);
    context.assert.deepStrictEqual(node.location, testLocation);
});

test('CommentSyntaxNode: should accept empty string value', (context: TestContext) => {
    const node = new CommentSyntaxNode("", testLocation);

    context.assert.strictEqual(node.value, "");
    context.assert.deepStrictEqual(node.location, testLocation);
    context.assert.strictEqual(node.trivia, null);
});

test('CommentSyntaxNode: should be extensible in the future', (context: TestContext) => {
    class ExtendedComment extends CommentSyntaxNode { public kind = "ts"; }
    const node = new ExtendedComment("// TODO", testLocation);

    context.assert.strictEqual(node.value, "// TODO");
    context.assert.strictEqual(node.kind, "ts");
    context.assert.deepStrictEqual(node.location, testLocation);
});

test('CommentSyntaxNode: value cannot be reassigned', (context: TestContext) => {
    const content = "// a comment";
    const node = new CommentSyntaxNode(content, testLocation);

    try {
        (node as any).value = "// another comment";
        context.assert.fail("Value should be immutable.");
    }
    catch {
        context.assert.ok(true, "Value is immutable as expected.");
    }
});

test('CommentSyntaxNode: location cannot be reassigned', (context: TestContext) => {
    const node = new CommentSyntaxNode("// a comment", testLocation);

    try {
        (node as any).location = new Location(0, 0, 0, 20, "new location", []);
        context.assert.fail("Location should be immutable.");
    }
    catch {
        context.assert.ok(true, "Location is immutable as expected.");
    }
});

test('CommentSyntaxNode: value cannot be undefined', (context: TestContext) => {
    try {
        const node = new CommentSyntaxNode(undefined as any, testLocation);
        context.assert.fail("Value cannot be undefined.");
    }
    catch {
        context.assert.ok(true, "Undefined value is correctly prevented.");
    }
});

test('CommentSyntaxNode: trivia is null by default', (context: TestContext) => {
    const node = new CommentSyntaxNode("// a comment", testLocation);

    context.assert.strictEqual(node.trivia, null);
});

test('CommentSyntaxNode: trivia can be assigned', (context: TestContext) => {
    const trivia = new TriviaSyntaxNode("", testLocation);
    const node = new CommentSyntaxNode("// a comment", testLocation, trivia);

    context.assert.strictEqual(node.trivia, trivia);
});

test('CommentSyntaxNode: trivia cannot be reassigned', (context: TestContext) => {
    const trivia = new TriviaSyntaxNode("", testLocation);
    const node = new CommentSyntaxNode("// a comment", testLocation, trivia);

    try {
        (node as any).trivia = null;
        context.assert.fail("Trivia should be immutable.");
    }
    catch {
        context.assert.ok(true, "Trivia is immutable.");
    }
});