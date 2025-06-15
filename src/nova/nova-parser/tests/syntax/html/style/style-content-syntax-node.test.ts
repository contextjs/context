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
import { StyleContentSyntaxNode } from "../../../../src/syntax/html/style/style-content-syntax-node.js";
import { TriviaSyntaxNode } from "../../../../src/syntax/common/trivia-syntax-node.js";

const testLocation = new Location(0, 0, 0, 10, "", []);

test('StyleContentSyntaxNode: should instantiate with value and location', (context: TestContext) => {
    const content = "body { color: red; }";
    const node = new StyleContentSyntaxNode(content, testLocation);

    context.assert.ok(node instanceof StyleContentSyntaxNode);
    context.assert.ok(node instanceof ValueSyntaxNode);
    context.assert.ok(node instanceof LocationSyntaxNode);
    context.assert.ok(node instanceof SyntaxNode);
    context.assert.strictEqual(node.value, content);
    context.assert.deepStrictEqual(node.location, testLocation);
});

test('StyleContentSyntaxNode: should accept null value', (context: TestContext) => {
    const node = new StyleContentSyntaxNode(null, testLocation);

    context.assert.strictEqual(node.value, null);
    context.assert.deepStrictEqual(node.location, testLocation);
});

test('StyleContentSyntaxNode: should be extensible in the future', (context: TestContext) => {
    class ExtendedStyleContent extends StyleContentSyntaxNode {
        public media: string = "screen";
    }
    const node = new ExtendedStyleContent("h1 { font-size: 2em; }", testLocation);

    context.assert.strictEqual(node.value, "h1 { font-size: 2em; }");
    context.assert.strictEqual(node.media, "screen");
    context.assert.deepStrictEqual(node.location, testLocation);
});

test('StyleContentSyntaxNode: value cannot be reassigned', (context: TestContext) => {
    const content = "body { color: red; }";
    const node = new StyleContentSyntaxNode(content, testLocation);

    try {
        (node as any).value = "new value";
        context.assert.fail("Value should be immutable.");
    }
    catch {
        context.assert.ok(true, "Value is immutable as expected.");
    }
});

test('StyleContentSyntaxNode: location cannot be reassigned', (context: TestContext) => {
    const node = new StyleContentSyntaxNode("body { color: red; }", testLocation);

    try {
        (node as any).location = new Location(0, 0, 0, 20, "new location", []);
        context.assert.fail("Location should be immutable.");
    }
    catch {
        context.assert.ok(true, "Location is immutable as expected.");
    }
});

test('StyleContentSyntaxNode: value cannot be undefined', (context: TestContext) => {
    try {
        const node = new StyleContentSyntaxNode(undefined as any, testLocation);
        context.assert.fail("Value cannot be undefined.");
    }
    catch {
        context.assert.ok(true, "Undefined value is correctly prevented.");
    }
});

test('StyleContentSyntaxNode: trivia is null by default', (context: TestContext) => {
    const node = new StyleContentSyntaxNode("body { color: red; }", testLocation);

    context.assert.strictEqual(node.trivia, null);
});

test('StyleContentSyntaxNode: trivia can be assigned', (context: TestContext) => {
    const trivia = new TriviaSyntaxNode("", null!);
    const node = new StyleContentSyntaxNode("body { color: red; }", testLocation, trivia);

    context.assert.strictEqual(node.trivia, trivia);
});

test('StyleContentSyntaxNode: trivia cannot be reassigned', (context: TestContext) => {
    const trivia = new TriviaSyntaxNode("", null!);
    const node = new StyleContentSyntaxNode("body { color: red; }", testLocation, trivia);

    try {
        (node as any).trivia = null;
        context.assert.fail("Trivia should be immutable.");
    }
    catch {
        context.assert.ok(true, "Trivia is immutable.");
    }
});