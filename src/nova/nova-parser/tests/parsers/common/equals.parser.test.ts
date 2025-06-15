/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { ParserContext } from "../../../src/context/parser-context.js";
import { DiagnosticMessages } from "../../../src/diagnostics/diagnostic-messages.js";
import { EqualsParser } from "../../../src/parsers/common/equals.parser.js";
import { Source } from "../../../src/sources/source.js";
import { EqualsSyntaxNode } from "../../../src/syntax/common/equals-syntax-node.js";
import { TriviaSyntaxNode } from "../../../src/syntax/common/trivia-syntax-node.js";

function parseEquals(input: string) {
    const parserContext = new ParserContext(new Source(input), null!);
    const node = EqualsParser.parse(parserContext);
    return { node, parserContext };
}

test("EqualsParser: parses single equals", (context: TestContext) => {
    const { node } = parseEquals("=");

    context.assert.ok(node instanceof EqualsSyntaxNode);
    context.assert.strictEqual(node.value, "=");
    context.assert.strictEqual(node.trivia, null);
});

test("EqualsParser: attaches trivia (whitespace) after equals", (context: TestContext) => {
    const { node } = parseEquals("=  ");

    context.assert.ok(node instanceof EqualsSyntaxNode);
    context.assert.strictEqual(node.value, "=");
    context.assert.ok(node.trivia instanceof TriviaSyntaxNode);
    context.assert.strictEqual(node.trivia?.value, "  ");
});

test("EqualsParser: attaches unicode whitespace after equals", (context: TestContext) => {
    const { node } = parseEquals("=\u2003");

    context.assert.ok(node instanceof EqualsSyntaxNode);
    context.assert.strictEqual(node.trivia?.value, "\u2003");
});

test("EqualsParser: returns diagnostic for missing equals", (context: TestContext) => {
    const { node, parserContext } = parseEquals("a");

    context.assert.ok(node instanceof EqualsSyntaxNode);
    context.assert.strictEqual(node.value, "a");
    context.assert.strictEqual(parserContext.diagnostics[0].message.code, DiagnosticMessages.ExpectedEquals.code);
    context.assert.strictEqual(parserContext.diagnostics[0].message.message, DiagnosticMessages.ExpectedEquals.message);
});

test("EqualsParser: attaches trivia for tabs/newlines after equals", (context: TestContext) => {
    const { node } = parseEquals("=\t\n");

    context.assert.ok(node instanceof EqualsSyntaxNode);
    context.assert.strictEqual(node.trivia!.value, "\t\n");
});

test("EqualsParser: parses only the first character if multiple equals", (context: TestContext) => {
    const { node } = parseEquals("==");

    context.assert.ok(node instanceof EqualsSyntaxNode);
    context.assert.strictEqual(node.value, "=");
});

test("EqualsParser: attaches no trivia if equals is at end of input", (context: TestContext) => {
    const { node } = parseEquals("=");

    context.assert.strictEqual(node.trivia, null);
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
    context.assert.strictEqual(parserContext.diagnostics[0].message.code, DiagnosticMessages.ExpectedEquals.code);
    context.assert.strictEqual(parserContext.diagnostics[0].message.message, DiagnosticMessages.ExpectedEquals.message);
});