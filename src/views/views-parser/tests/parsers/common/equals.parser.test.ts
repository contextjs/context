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
import { EqualsParser } from "../../../src/parsers/common/equals.parser.js";
import { EqualsSyntaxNode } from "../../../src/syntax/common/equals-syntax-node.js";

function parseEquals(input: string) {
    const parserContext = new ParserContext(new Source(input), null!);
    const node = EqualsParser.parse(parserContext);
    return { node, parserContext };
}

test("EqualsParser: parses single equals", (context: TestContext) => {
    const { node } = parseEquals("=");

    context.assert.ok(node instanceof EqualsSyntaxNode);
    context.assert.strictEqual(node.value, "=");
    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("EqualsParser: ignores trailing characters after single equals", (context: TestContext) => {
    const { node } = parseEquals("=  ");

    context.assert.ok(node instanceof EqualsSyntaxNode);
    context.assert.strictEqual(node.value, "=");
    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("EqualsParser: ignores unicode whitespace after equals", (context: TestContext) => {
    const { node } = parseEquals("=\u2003");

    context.assert.ok(node instanceof EqualsSyntaxNode);
    context.assert.strictEqual(node.value, "=");
    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("EqualsParser: returns diagnostic for missing equals (letter input)", (context: TestContext) => {
    const { node, parserContext } = parseEquals("a");

    context.assert.ok(node instanceof EqualsSyntaxNode);
    context.assert.strictEqual(node.value, "a");
    context.assert.ok(parserContext.diagnostics[0].message.code === DiagnosticMessages.ExpectedEquals.code);
    context.assert.ok(parserContext.diagnostics[0].message.message === DiagnosticMessages.ExpectedEquals.message);
});

test("EqualsParser: parses only the first character if multiple equals", (context: TestContext) => {
    const { node } = parseEquals("==");

    context.assert.ok(node instanceof EqualsSyntaxNode);
    context.assert.strictEqual(node.value, "=");
    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("EqualsParser: attaches no trivia if equals is at end of input", (context: TestContext) => {
    const { node } = parseEquals("=");

    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("EqualsParser: handles empty input with diagnostic", (context: TestContext) => {
    const { node, parserContext } = parseEquals("");

    context.assert.ok(node instanceof EqualsSyntaxNode);
    context.assert.strictEqual(node.value, "");
    context.assert.ok(parserContext.diagnostics.some(d => d.message.code === DiagnosticMessages.ExpectedEquals.code));
});

test("EqualsParser: handles non-equals character as input", (context: TestContext) => {
    const { node, parserContext } = parseEquals("?");

    context.assert.ok(node instanceof EqualsSyntaxNode);
    context.assert.strictEqual(node.value, "?");
    context.assert.ok(parserContext.diagnostics[0].message.code === DiagnosticMessages.ExpectedEquals.code);
    context.assert.ok(parserContext.diagnostics[0].message.message === DiagnosticMessages.ExpectedEquals.message);
});