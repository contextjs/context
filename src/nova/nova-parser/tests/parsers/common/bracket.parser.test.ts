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
import { BracketParser } from "../../../src/parsers/common/bracket.parser.js";
import { Source } from "../../../src/sources/source.js";
import { BracketSyntaxNode } from "../../../src/syntax/common/bracket-syntax-node.js";
import { TriviaSyntaxNode } from "../../../src/syntax/common/trivia-syntax-node.js";

function parseBracket(input: string, expected: "<" | ">" | "/>") {
    const parserContext = new ParserContext(new Source(input), null!);
    const node = BracketParser.parse(parserContext, expected);
    return { node, parserContext };
}

test("BracketParser: parses single opening bracket '<'", (context: TestContext) => {
    const { node } = parseBracket("<", "<");

    context.assert.ok(node instanceof BracketSyntaxNode);
    context.assert.strictEqual(node.value, "<");
    context.assert.strictEqual(node.trivia, null);
});

test("BracketParser: parses single closing bracket '>'", (context: TestContext) => {
    const { node } = parseBracket(">", ">");

    context.assert.ok(node instanceof BracketSyntaxNode);
    context.assert.strictEqual(node.value, ">");
    context.assert.strictEqual(node.trivia, null);
});

test("BracketParser: attaches trivia (whitespace) after bracket", (context: TestContext) => {
    const { node } = parseBracket("<   ", "<");

    context.assert.ok(node instanceof BracketSyntaxNode);
    context.assert.strictEqual(node.value, "<");
    context.assert.ok(node.trivia instanceof TriviaSyntaxNode);
    context.assert.strictEqual(node.trivia?.value, "   ");
});

test("BracketParser: attaches unicode trivia after bracket", (context: TestContext) => {
    const { node } = parseBracket(">\u2003", ">");

    context.assert.ok(node instanceof BracketSyntaxNode);
    context.assert.strictEqual(node.value, ">");
    context.assert.ok(node.trivia instanceof TriviaSyntaxNode);
    context.assert.strictEqual(node.trivia?.value, "\u2003");
});

test("BracketParser: returns diagnostic for missing opening bracket", (context: TestContext) => {
    const { node, parserContext } = parseBracket("a", "<");

    context.assert.ok(node instanceof BracketSyntaxNode);
    context.assert.strictEqual(node.value, "a");
    context.assert.strictEqual(parserContext.diagnostics[0].message.code, DiagnosticMessages.ExpectedBracket("<").code);
    context.assert.strictEqual(parserContext.diagnostics[0].message.message, DiagnosticMessages.ExpectedBracket("<").message);
});

test("BracketParser: returns diagnostic for missing closing bracket", (context: TestContext) => {
    const { node, parserContext } = parseBracket("a", ">");

    context.assert.ok(node instanceof BracketSyntaxNode);
    context.assert.strictEqual(node.value, "a");
    context.assert.strictEqual(parserContext.diagnostics[0].message.code, DiagnosticMessages.ExpectedBracket(">").code);
    context.assert.strictEqual(parserContext.diagnostics[0].message.message, DiagnosticMessages.ExpectedBracket(">").message);
});

test("BracketParser: attaches trivia for tabs/newlines after bracket", (context: TestContext) => {
    const { node } = parseBracket(">\t\n", ">");

    context.assert.ok(node instanceof BracketSyntaxNode);
    context.assert.strictEqual(node.value, ">");
    context.assert.ok(node.trivia instanceof TriviaSyntaxNode);
    context.assert.strictEqual(node.trivia?.value, "\t\n");
});

test("BracketParser: parses only the first character if multiple brackets", (context: TestContext) => {
    const { node } = parseBracket("<<", "<");

    context.assert.ok(node instanceof BracketSyntaxNode);
    context.assert.strictEqual(node.value, "<");
    context.assert.strictEqual(node.trivia, null);
});

test("BracketParser: attaches no trivia if bracket is at end of input", (context: TestContext) => {
    const { node } = parseBracket(">", ">");

    context.assert.strictEqual(node.trivia, null);
});

test("BracketParser: handles empty input with diagnostic", (context: TestContext) => {
    const { node, parserContext } = parseBracket("", "<");

    context.assert.ok(node instanceof BracketSyntaxNode);
    context.assert.strictEqual(node.value, "");
    context.assert.ok(parserContext.diagnostics.some(d => d.message.code === DiagnosticMessages.ExpectedBracket("<").code));
});

test("BracketParser: handles non-bracket character as input", (context: TestContext) => {
    const { node, parserContext } = parseBracket("?", "<");

    context.assert.ok(node instanceof BracketSyntaxNode);
    context.assert.strictEqual(node.value, "?");
    context.assert.strictEqual(parserContext.diagnostics[0].message.code, DiagnosticMessages.ExpectedBracket("<").code);
    context.assert.strictEqual(parserContext.diagnostics[0].message.message, DiagnosticMessages.ExpectedBracket("<").message);
});

test("BracketParser: parses multi-character bracket '/>'", (context: TestContext) => {
    const { node } = parseBracket("/>", "/>");

    context.assert.ok(node instanceof BracketSyntaxNode);
    context.assert.strictEqual(node.value, "/>");
    context.assert.strictEqual(node.trivia, null);
});

test("BracketParser: attaches trivia (whitespace) after multi-character bracket '/>'", (context: TestContext) => {
    const { node } = parseBracket("/>   ", "/>");

    context.assert.ok(node instanceof BracketSyntaxNode);
    context.assert.strictEqual(node.value, "/>");
    context.assert.ok(node.trivia instanceof TriviaSyntaxNode);
    context.assert.strictEqual(node.trivia?.value, "   ");
});

test("BracketParser: returns diagnostic for missing multi-character bracket '/>'", (context: TestContext) => {
    const { node, parserContext } = parseBracket("a", "/>");

    context.assert.ok(node instanceof BracketSyntaxNode);
    context.assert.strictEqual(node.value, "a");
    context.assert.ok(parserContext.diagnostics.some(d => d.message.code === DiagnosticMessages.ExpectedBracket("/>").code));
});

test("BracketParser: handles input that almost matches multi-character bracket (only '/')", (context: TestContext) => {
    const { node, parserContext } = parseBracket("/", "/>");

    context.assert.ok(node instanceof BracketSyntaxNode);
    context.assert.strictEqual(node.value, "/");
    context.assert.ok(parserContext.diagnostics.some(d => d.message.code === DiagnosticMessages.ExpectedBracket("/>").code));
});

test("BracketParser: parses only the first occurrence of multi-character bracket in repeated sequence", (context: TestContext) => {
    const { node } = parseBracket("/>/>", "/>");

    context.assert.ok(node instanceof BracketSyntaxNode);
    context.assert.strictEqual(node.value, "/>");
    context.assert.strictEqual(node.trivia, null);
});

test("BracketParser: attaches unicode trivia after multi-character bracket", (context: TestContext) => {
    const { node } = parseBracket("/>\u2003", "/>");

    context.assert.ok(node instanceof BracketSyntaxNode);
    context.assert.strictEqual(node.value, "/>");
    context.assert.ok(node.trivia instanceof TriviaSyntaxNode);
    context.assert.strictEqual(node.trivia?.value, "\u2003");
});

test("BracketParser: handles empty input with diagnostic for multi-character bracket", (context: TestContext) => {
    const { node, parserContext } = parseBracket("", "/>");

    context.assert.ok(node instanceof BracketSyntaxNode);
    context.assert.strictEqual(node.value, "");
    context.assert.ok(parserContext.diagnostics.some(d => d.message.code === DiagnosticMessages.ExpectedBracket("/>").code));
});