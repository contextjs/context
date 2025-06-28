/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { DiagnosticMessages, Source } from "@contextjs/views";
import test, { TestContext } from "node:test";
import { ParserContext } from "../../../src/context/parser-context.js";
import { TransitionParser } from "../../../src/parsers/common/transition.parser.js";
import { EndOfFileSyntaxNode } from "../../../src/syntax/common/end-of-file-syntax-node.js";
import { TransitionSyntaxNode } from "../../../src/syntax/common/transition-syntax-node.js";
import { TestParser } from "../../_fixtures/parsers-fixtures.js";

function parseTransition(input: string) {
    const parserContext = new ParserContext(new Source(input), TestParser);
    const node = TransitionParser.parse(parserContext);
    return { node, parserContext };
}

test("TransitionParser: parses single transition '@'", (context: TestContext) => {
    const { node, parserContext } = parseTransition("@");

    context.assert.ok(node instanceof TransitionSyntaxNode);
    context.assert.strictEqual(node.value, "@");
    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, null);
    context.assert.strictEqual(parserContext.currentCharacter, EndOfFileSyntaxNode.endOfFile);
});

test("TransitionParser: adds diagnostic if input is not transition", (context: TestContext) => {
    const { node, parserContext } = parseTransition("#");

    context.assert.ok(node instanceof TransitionSyntaxNode);
    context.assert.strictEqual(parserContext.diagnostics.length, 1);
    context.assert.strictEqual(parserContext.diagnostics[0].message.code, DiagnosticMessages.ExpectedTransitionMarker("#").code);
    context.assert.strictEqual(node.value, "#");
});

test("TransitionParser: parses transition with multiple trailing whitespace", (context: TestContext) => {
    const { node, parserContext } = parseTransition("@   ");

    context.assert.strictEqual(node.value, "@");
    context.assert.strictEqual(node.trailingTrivia, null);
    context.assert.strictEqual(parserContext.diagnostics.length, 1);
    context.assert.strictEqual(parserContext.diagnostics[0].message.code, DiagnosticMessages.NoWhitespaceAfterTransition.code);
    context.assert.strictEqual(parserContext.diagnostics[0].message.message, DiagnosticMessages.NoWhitespaceAfterTransition.message);
});

test("TransitionParser: handles input with only whitespace (should produce diagnostic)", (context: TestContext) => {
    const { node, parserContext } = parseTransition(" ");

    context.assert.ok(node instanceof TransitionSyntaxNode);
    context.assert.strictEqual(node.value, " ");
    context.assert.ok(parserContext.diagnostics.length > 0);
});

test("TransitionParser: handles empty input (should produce diagnostic)", (context: TestContext) => {
    const { node, parserContext } = parseTransition("");

    context.assert.ok(node instanceof TransitionSyntaxNode);
    context.assert.strictEqual(node.value, "");
    context.assert.ok(parserContext.diagnostics.some(d => d.message.code === DiagnosticMessages.ExpectedTransitionMarker("").code));
});

test("TransitionParser: does not consume more than one @", (context: TestContext) => {
    const { node, parserContext } = parseTransition("@@");

    context.assert.strictEqual(node.value, "@");
    context.assert.strictEqual(parserContext.currentCharacter, "@");
});

test("TransitionParser: does not treat @@ as escaped here", (context: TestContext) => {
    const { node, parserContext } = parseTransition("@@abc");

    context.assert.strictEqual(node.value, "@");
    context.assert.strictEqual(parserContext.currentCharacter, "@");
});

test("TransitionParser: parses transition at EOF", (context: TestContext) => {
    const { node, parserContext } = parseTransition("@");

    context.assert.ok(node instanceof TransitionSyntaxNode);
    context.assert.strictEqual(node.value, "@");
    context.assert.strictEqual(parserContext.currentCharacter, EndOfFileSyntaxNode.endOfFile);
});