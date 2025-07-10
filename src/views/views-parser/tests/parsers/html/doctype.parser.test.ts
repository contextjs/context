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
import { DoctypeParser } from "../../../src/parsers/html/doctype.parser.js";
import { TriviaSyntaxNode } from "../../../src/syntax/common/trivia-syntax-node.js";
import { DoctypeSyntaxNode } from "../../../src/syntax/html/doctype-syntax-node.js";

function createContext(input: string): ParserContext {
    return new ParserContext(new Source(input), null!);
}

test("DoctypeParser: parses minimal DOCTYPE", (context: TestContext) => {
    const parserContext = createContext("<!DOCTYPE html>");
    const node = DoctypeParser.parse(parserContext);

    context.assert.ok(node instanceof DoctypeSyntaxNode);
    context.assert.strictEqual(node.value, "<!DOCTYPE html>");
    context.assert.strictEqual(node.trailingTrivia, null);
    context.assert.deepStrictEqual(parserContext.diagnostics, []);
});

test("DoctypeParser: parses DOCTYPE with leading and trailing spaces/newlines", (context: TestContext) => {
    const parserContext = createContext("<!DOCTYPE html>   \n\r\t");
    const node = DoctypeParser.parse(parserContext);

    context.assert.ok(node instanceof DoctypeSyntaxNode);
    context.assert.strictEqual(node.value, "<!DOCTYPE html>");
    context.assert.ok(node.trailingTrivia instanceof TriviaSyntaxNode);
    context.assert.strictEqual(node.trailingTrivia.value, "   \n\r\t");
});

test("DoctypeParser: parses legacy DOCTYPE with quoted identifiers", (context: TestContext) => {
    const input = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">';
    const parserContext = createContext(input);
    const node = DoctypeParser.parse(parserContext);

    context.assert.ok(node instanceof DoctypeSyntaxNode);
    context.assert.strictEqual(node.value, input);
    context.assert.strictEqual(node.trailingTrivia, null);
    context.assert.deepStrictEqual(parserContext.diagnostics, []);
});

test("DoctypeParser: supports mixed-case and whitespace-insensitive detection", (context: TestContext) => {
    const parserContext = createContext("<!dOcTyPe    html>");
    const node = DoctypeParser.parse(parserContext);

    context.assert.ok(node instanceof DoctypeSyntaxNode);
    context.assert.strictEqual(node.value, "<!dOcTyPe    html>");
    context.assert.strictEqual(node.trailingTrivia, null);
    context.assert.deepStrictEqual(parserContext.diagnostics, []);
});

test("DoctypeParser: emits diagnostic on unterminated DOCTYPE (missing '>')", (context: TestContext) => {
    const parserContext = createContext("<!DOCTYPE html");
    const node = DoctypeParser.parse(parserContext);

    context.assert.ok(node instanceof DoctypeSyntaxNode);
    context.assert.strictEqual(node.value, "<!DOCTYPE html");
    context.assert.strictEqual(node.trailingTrivia, null);

    context.assert.ok(Array.isArray(parserContext.diagnostics));
    context.assert.strictEqual(parserContext.diagnostics.length, 1);
    context.assert.strictEqual(parserContext.diagnostics[0].message, DiagnosticMessages.UnterminatedDoctype);
});

test("DoctypeParser: parses DOCTYPE followed by HTML and leaves context positioned at next character", (context: TestContext) => {
    const input = "<!DOCTYPE html>\n<html>";
    const parserContext = createContext(input);
    const node = DoctypeParser.parse(parserContext);

    context.assert.ok(node instanceof DoctypeSyntaxNode);
    context.assert.strictEqual(node.value, "<!DOCTYPE html>");
    context.assert.ok(node.trailingTrivia instanceof TriviaSyntaxNode);
    context.assert.strictEqual(node.trailingTrivia.value, "\n");
    context.assert.strictEqual(parserContext.currentCharacter, "<");
});

test("DoctypeParser: parses DOCTYPE followed by comment", (context: TestContext) => {
    const input = "<!DOCTYPE html><!--comment-->";
    const parserContext = createContext(input);
    const node = DoctypeParser.parse(parserContext);

    context.assert.ok(node instanceof DoctypeSyntaxNode);
    context.assert.strictEqual(node.value, "<!DOCTYPE html>");
});

test("DoctypeParser: parses DOCTYPE with excessive whitespace inside declaration", (context: TestContext) => {
    const input = "<!DOCTYPE     html    >";
    const parserContext = createContext(input);
    const node = DoctypeParser.parse(parserContext);

    context.assert.ok(node instanceof DoctypeSyntaxNode);
    context.assert.strictEqual(node.value, "<!DOCTYPE     html    >");
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("DoctypeParser: parses multiple DOCTYPE declarations sequentially", (context: TestContext) => {
    const input = "<!DOCTYPE html>\n<!DOCTYPE html>";
    const parserContext = createContext(input);

    const first = DoctypeParser.parse(parserContext);
    const second = DoctypeParser.parse(parserContext);

    context.assert.ok(first instanceof DoctypeSyntaxNode);
    context.assert.strictEqual(first.value, "<!DOCTYPE html>");
    context.assert.ok(first.trailingTrivia instanceof TriviaSyntaxNode);
    context.assert.strictEqual(first.trailingTrivia.value, "\n");
    
    context.assert.ok(second instanceof DoctypeSyntaxNode);
    context.assert.strictEqual(second.value, "<!DOCTYPE html>");
});
