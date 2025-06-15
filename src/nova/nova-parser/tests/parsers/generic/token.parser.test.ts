/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { StringBuilder } from "@contextjs/text";
import test, { TestContext } from "node:test";
import { ParserContext } from "../../../src/context/parser-context.js";
import { DiagnosticMessages } from "../../../src/diagnostics/diagnostic-messages.js";
import { TokenParser } from "../../../src/parsers/generic/token.parser.js";
import { Source } from "../../../src/sources/source.js";
import { ValueSyntaxNode } from "../../../src/syntax/abstracts/value-syntax-node.js";
import { TestParser } from "../../_fixtures/parsers-fixtures.js";

class TestTokenNode extends ValueSyntaxNode { }

function parseToken(
    input: string,
    shouldStop: (context: ParserContext, builder: StringBuilder) => boolean,
    postParse?: (context: ParserContext, builder: StringBuilder) => void) {
    const parserContext = new ParserContext(new Source(input), TestParser);
    const node = TokenParser.parse(parserContext, TestTokenNode, shouldStop, postParse);

    return { node, parserContext };
}

test("TokenParser: parses single character token", (context: TestContext) => {
    const { node } = parseToken("=", (parserContext, builder) => builder.length >= 1);

    context.assert.strictEqual(node.value, "=");
});

test("TokenParser: parses multi-character token", (context: TestContext) => {
    const { node } = parseToken("{{", (parserContext, builder) => builder.length >= 2);

    context.assert.strictEqual(node.value, "{{");
});

test("TokenParser: stops on custom shouldStop (stop after first letter)", (context: TestContext) => {
    const { node } = parseToken("foobar", (parserContext, builder) => builder.length >= 1);

    context.assert.strictEqual(node.value, "f");
});

test("TokenParser: parses Unicode symbol token", (context: TestContext) => {
    const { node } = parseToken("π", (parserContext, builder) => builder.length >= 1);

    context.assert.strictEqual(node.value, "π");
});

test("TokenParser: parses multi-character Unicode token", (context: TestContext) => {
    const { node } = parseToken("💡💡", (parserContext, builder) => builder.length >= 4);

    context.assert.strictEqual(node.value, "💡💡");
});

test("TokenParser: attaches trivia", (context: TestContext) => {
    const { node } = parseToken("= ", (parserContext, builder) => builder.length >= 1);

    context.assert.strictEqual(node.value, "=");
    context.assert.strictEqual(node.trivia!.value, " ");
});

test("TokenParser: returns empty value and diagnostic at EOF", (context: TestContext) => {
    const { node, parserContext } = parseToken("", (parserContext, builder) => builder.length >= 1);

    context.assert.strictEqual(node.value, "");
    context.assert.ok(parserContext.diagnostics.some(d => d.message.code === DiagnosticMessages.UnexpectedEndOfInput.code));
});

test("TokenParser: returns whatever was read up to EOF if shouldStop never returns true", (context: TestContext) => {
    const { node, parserContext } = parseToken("abc", (parserContext, builder) => false);

    context.assert.strictEqual(node.value, "abc");
    context.assert.ok(parserContext.diagnostics.some(d => d.message.code === DiagnosticMessages.UnexpectedEndOfInput.code));
});

test("TokenParser: invokes postParse callback", (context: TestContext) => {
    let called = false;
    const { node } = parseToken("=", (parserContext, builder) => builder.length >= 1, (parserContext, builder) => { called = true; });

    context.assert.strictEqual(node.value, "=");
    context.assert.ok(called);
});

test("TokenParser: postParse can add diagnostics", (context: TestContext) => {
    const { node, parserContext } = parseToken("!", (parserContext, builder) => builder.length >= 1, (parserContext, builder) => {
        if (builder.toString() !== "=")
            parserContext.addErrorDiagnostic(DiagnosticMessages.ExpectedEquals);
    });

    context.assert.strictEqual(node.value, "!");
    context.assert.ok(parserContext.diagnostics.some(d => d.message.code === DiagnosticMessages.ExpectedEquals.code));
});

test("TokenParser: parses only first token (builder pattern)", (context: TestContext) => {
    const { node } = parseToken("==", (parserContext, builder) => builder.length >= 1);

    context.assert.strictEqual(node.value, "=");
});

test("TokenParser: parses entire input if shouldStop is never true", (context: TestContext) => {
    const { node } = parseToken("===", (parserContext, builder) => false);

    context.assert.strictEqual(node.value, "===");
});

test("TokenParser: parses only up to stop character", (context: TestContext) => {
    const { node } = parseToken("==!=", (parserContext, builder) => parserContext.currentCharacter !== "=");

    context.assert.strictEqual(node.value, "==");
});

test("TokenParser: parses with trivia and multi-char tokens", (context: TestContext) => {
    const { node } = parseToken("{{ ", (parserContext, builder) => builder.length >= 2);

    context.assert.strictEqual(node.value, "{{");
    context.assert.strictEqual(node.trivia!.value, " ");
});

test("TokenParser: builder can be inspected in postParse", (context: TestContext) => {
    let captured = "";
    parseToken("@@", (parserContext, builder) => builder.length >= 2, (parserContext, builder) => {
        captured = builder.toString();
    });

    context.assert.strictEqual(captured, "@@");
});

test("TokenParser: works for tokens in the middle of input (shouldStop custom)", (context: TestContext) => {
    const { node } = parseToken("foo=bar", (parserContext, builder) => parserContext.currentCharacter === "=" || builder.length >= 10);

    context.assert.strictEqual(node.value, "foo");
});

test("TokenParser: handles early exit (shouldStop true immediately)", (context: TestContext) => {
    const { node } = parseToken("foobar", (parserContext, builder) => true);

    context.assert.strictEqual(node.value, "");
});

test("TokenParser: parses emoji as token", (context: TestContext) => {
    const { node } = parseToken("😀😀😀", (parserContext, builder) => builder.length >= 6);

    context.assert.strictEqual(node.value, "😀😀😀");
});

test("TokenParser: respects moveNext and currentCharacter", (context: TestContext) => {
    const { node, parserContext } = parseToken("xy", (parserContext, builder) => builder.length >= 1);

    context.assert.strictEqual(parserContext.currentCharacter, "y");
});

test("TokenParser: handles stop at whitespace", (context: TestContext) => {
    const { node } = parseToken("foo bar", (parserContext, builder) => parserContext.currentCharacter === " ");

    context.assert.strictEqual(node.value, "foo");
});

test("TokenParser: handles input of only whitespace (trivia only)", (context: TestContext) => {
    const { node } = parseToken("   ", (parserContext, builder) => builder.length >= 1);

    context.assert.strictEqual(node.value, " ");
});

test("TokenParser: shouldStop on first character, with non-empty input", (context: TestContext) => {
    const { node } = parseToken("zzz", (parserContext, builder) => builder.length === 0);

    context.assert.strictEqual(node.value, "");
});

test("TokenParser: handles very large input efficiently", (context: TestContext) => {
    const largeInput = "a".repeat(10000);
    const { node } = parseToken(largeInput, (parserContext, builder) => builder.length >= 10000);

    context.assert.strictEqual(node.value!.length, 10000);
});

test("TokenParser: stop on non-BMP Unicode", (context: TestContext) => {
    const input = "foo𐍈bar";
    const { node } = parseToken(input, (parserContext, builder) => parserContext.peekMultiple(2) === "𐍈");

    context.assert.strictEqual(node.value, "foo");
});