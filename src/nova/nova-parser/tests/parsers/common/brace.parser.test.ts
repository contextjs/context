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
import { BraceParser } from "../../../src/parsers/common/brace.parser.js";
import { Source } from "../../../src/sources/source.js";
import { BraceSyntaxNode } from "../../../src/syntax/common/brace-syntax-node.js";
import { TriviaSyntaxNode } from "../../../src/syntax/common/trivia-syntax-node.js";

function parseBrace(input: string, expected: "{" | "}") {
    const parserContext = new ParserContext(new Source(input), null!);
    const node = BraceParser.parse(parserContext, expected);
    return { node, parserContext };
}

test("BraceParser: parses single opening brace '{'", (context: TestContext) => {
    const { node } = parseBrace("{", "{");

    context.assert.ok(node instanceof BraceSyntaxNode);
    context.assert.strictEqual(node.value, "{");
    context.assert.strictEqual(node.trivia, null);
});

test("BraceParser: parses single closing brace '}'", (context: TestContext) => {
    const { node } = parseBrace("}", "}");

    context.assert.ok(node instanceof BraceSyntaxNode);
    context.assert.strictEqual(node.value, "}");
    context.assert.strictEqual(node.trivia, null);
});

test("BraceParser: attaches trivia (whitespace) after brace", (context: TestContext) => {
    const { node } = parseBrace("{   ", "{");

    context.assert.ok(node instanceof BraceSyntaxNode);
    context.assert.strictEqual(node.value, "{");
    context.assert.ok(node.trivia instanceof TriviaSyntaxNode);
    context.assert.strictEqual(node.trivia?.value, "   ");
});

test("BraceParser: attaches unicode trivia after brace", (context: TestContext) => {
    const { node } = parseBrace("}\u2003", "}");

    context.assert.ok(node instanceof BraceSyntaxNode);
    context.assert.strictEqual(node.value, "}");
    context.assert.ok(node.trivia instanceof TriviaSyntaxNode);
    context.assert.strictEqual(node.trivia?.value, "\u2003");
});

test("BraceParser: returns diagnostic for missing opening brace", (context: TestContext) => {
    const { node, parserContext } = parseBrace("a", "{");

    context.assert.ok(node instanceof BraceSyntaxNode);
    context.assert.strictEqual(node.value, "a");
    context.assert.strictEqual(parserContext.diagnostics[0].message.code, DiagnosticMessages.ExpectedBrace("{").code);
    context.assert.strictEqual(parserContext.diagnostics[0].message.message, DiagnosticMessages.ExpectedBrace("{").message);
});

test("BraceParser: returns diagnostic for missing closing brace", (context: TestContext) => {
    const { node, parserContext } = parseBrace("a", "}");

    context.assert.ok(node instanceof BraceSyntaxNode);
    context.assert.strictEqual(node.value, "a");
    context.assert.strictEqual(parserContext.diagnostics[0].message.code, DiagnosticMessages.ExpectedBrace("}").code);
    context.assert.strictEqual(parserContext.diagnostics[0].message.message, DiagnosticMessages.ExpectedBrace("}").message);
});

test("BraceParser: attaches trivia for tabs/newlines after brace", (context: TestContext) => {
    const { node } = parseBrace("}\t\n", "}");

    context.assert.ok(node instanceof BraceSyntaxNode);
    context.assert.strictEqual(node.value, "}");
    context.assert.ok(node.trivia instanceof TriviaSyntaxNode);
    context.assert.strictEqual(node.trivia?.value, "\t\n");
});

test("BraceParser: parses only the first character if multiple braces", (context: TestContext) => {
    const { node } = parseBrace("{{", "{");

    context.assert.ok(node instanceof BraceSyntaxNode);
    context.assert.strictEqual(node.value, "{");
    context.assert.strictEqual(node.trivia, null);
});

test("BraceParser: attaches no trivia if brace is at end of input", (context: TestContext) => {
    const { node } = parseBrace("}", "}");

    context.assert.strictEqual(node.trivia, null);
});

test("BraceParser: handles empty input with diagnostic", (context: TestContext) => {
    const { node, parserContext } = parseBrace("", "{");

    context.assert.ok(node instanceof BraceSyntaxNode);
    context.assert.strictEqual(node.value, "");
    context.assert.ok(parserContext.diagnostics.some(d => d.message.code === DiagnosticMessages.ExpectedBrace("{").code));
});

test("BraceParser: handles non-brace character as input", (context: TestContext) => {
    const { node, parserContext } = parseBrace("?", "{");

    context.assert.ok(node instanceof BraceSyntaxNode);
    context.assert.strictEqual(node.value, "?");
    context.assert.strictEqual(parserContext.diagnostics[0].message.code, DiagnosticMessages.ExpectedBrace("{").code);
    context.assert.strictEqual(parserContext.diagnostics[0].message.message, DiagnosticMessages.ExpectedBrace("{").message);
});