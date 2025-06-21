/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-script license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { Location } from "../../../../src/sources/location.js";
import { TriviaSyntaxNode } from "../../../../src/syntax/common/trivia-syntax-node.js";
import { ScriptContentSyntaxNode } from "../../../../src/syntax/html/scripts/script-content-syntax-node.js";

const testLocation = new Location(0, 0, 0, 10, "", []);
const leadingTrivia = new TriviaSyntaxNode("lead", testLocation);
const trailingTrivia = new TriviaSyntaxNode("trail", testLocation);

test("ScriptContentSyntaxNode: constructs with value, location, and both trivia", (context: TestContext) => {
    const content = "body { color: red; }";
    const node = new ScriptContentSyntaxNode(content, testLocation, leadingTrivia, trailingTrivia);

    context.assert.strictEqual(node.value, content);
    context.assert.strictEqual(node.location, testLocation);
    context.assert.strictEqual(node.leadingTrivia, leadingTrivia);
    context.assert.strictEqual(node.trailingTrivia, trailingTrivia);
});

test("ScriptContentSyntaxNode: constructs with null value", (context: TestContext) => {
    const node = new ScriptContentSyntaxNode(null, testLocation);

    context.assert.strictEqual(node.value, null);
    context.assert.strictEqual(node.location, testLocation);
    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("ScriptContentSyntaxNode: supports only leading trivia", (context: TestContext) => {
    const node = new ScriptContentSyntaxNode("foo", testLocation, leadingTrivia);

    context.assert.strictEqual(node.leadingTrivia, leadingTrivia);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("ScriptContentSyntaxNode: supports only trailing trivia", (context: TestContext) => {
    const node = new ScriptContentSyntaxNode("foo", testLocation, null, trailingTrivia);

    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, trailingTrivia);
});

test("ScriptContentSyntaxNode: is extensible via subclass", (context: TestContext) => {
    class ExtendedScriptContent extends ScriptContentSyntaxNode { public media: string = "screen"; }
    const node = new ExtendedScriptContent("h1 { font-size: 2em; }", testLocation);

    context.assert.strictEqual(node.value, "h1 { font-size: 2em; }");
    context.assert.strictEqual(node.media, "screen");
    context.assert.strictEqual(node.location, testLocation);
});