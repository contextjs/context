/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { StringBuilder } from "@contextjs/text";
import { Source } from "@contextjs/views";
import test, { TestContext } from "node:test";
import { ParserContext } from "../../../src/context/parser-context.js";
import { ContentParser } from "../../../src/parsers/generic/content.parser.js";
import { ValueSyntaxNode } from "../../../src/syntax/abstracts/value-syntax-node.js";
import { TestParser } from "../../_fixtures/parsers-fixtures.js";

class TestTokenNode extends ValueSyntaxNode { }

function parseToken(
    input: string,
    shouldStopParsing: (parserContext: ParserContext, valueBuilder: StringBuilder) => boolean) {
    const parserContext = new ParserContext(new Source(input), TestParser);
    const node = ContentParser.parse(
        parserContext, 
        (value, leadingTrivia, trailingTrivia) => new TestTokenNode(value, leadingTrivia, trailingTrivia),
        shouldStopParsing);

    return { node, parserContext };
}

test("ContentParser: parses single character token", (context: TestContext) => {
    const { node } = parseToken("=", (parserContext: ParserContext, valueBuilder: StringBuilder) => valueBuilder.length >= 1);

    context.assert.strictEqual(node.value, "=");
});

test("ContentParser: parses multi-character token", (context: TestContext) => {
    const { node } = parseToken("{{", (parserContext: ParserContext, valueBuilder: StringBuilder) => valueBuilder.length >= 2);

    context.assert.strictEqual(node.value, "{{");
});

test("ContentParser: stops on custom predicate", (context: TestContext) => {
    const { node } = parseToken("foobar", (parserContext: ParserContext, valueBuilder: StringBuilder) => valueBuilder.length >= 1);

    context.assert.strictEqual(node.value, "f");
});

test("ContentParser: parses Unicode symbol", (context: TestContext) => {
    const { node } = parseToken("π", (parserContext: ParserContext, valueBuilder: StringBuilder) => valueBuilder.length >= 1);

    context.assert.strictEqual(node.value, "π");
});

test("ContentParser: parses multiple Unicode symbols", (context: TestContext) => {
    const { node } = parseToken("💡💡", (parserContext: ParserContext, valueBuilder: StringBuilder) => valueBuilder.length >= 4);

    context.assert.strictEqual(node.value, "💡💡");
});

test("ContentParser: handles empty input", (context: TestContext) => {
    const { node } = parseToken("", (parserContext: ParserContext, valueBuilder: StringBuilder) => false);

    context.assert.strictEqual(node.value, "");
});

test("ContentParser: stops at EOF if predicate never returns true", (context: TestContext) => {
    const { node } = parseToken("abc", (parserContext: ParserContext, valueBuilder: StringBuilder) => false);

    context.assert.strictEqual(node.value, "abc");
});

test("ContentParser: parses only first character", (context: TestContext) => {
    const { node } = parseToken("==", (parserContext: ParserContext, valueBuilder: StringBuilder) => valueBuilder.length >= 1);

    context.assert.strictEqual(node.value, "=");
});

test("ContentParser: parses entire input if never stopped", (context: TestContext) => {
    const { node } = parseToken("===", (parserContext: ParserContext, valueBuilder: StringBuilder) => false);

    context.assert.strictEqual(node.value, "===");
});

test("ContentParser: parses up to stop character", (context: TestContext) => {
    const { node } = parseToken("==!=", (parserContext: ParserContext, valueBuilder: StringBuilder) => parserContext.currentCharacter !== "=");

    context.assert.strictEqual(node.value, "==");
});

test("ContentParser: stops in middle of input", (context: TestContext) => {
    const { node } = parseToken("foo=bar", (parserContext: ParserContext, valueBuilder: StringBuilder) =>
        parserContext.currentCharacter === "=" || valueBuilder.length >= 10);

    context.assert.strictEqual(node.value, "foo");
});

test("ContentParser: immediate stop on first character", (context: TestContext) => {
    const { node } = parseToken("foobar", (parserContext: ParserContext, valueBuilder: StringBuilder) => true);

    context.assert.strictEqual(node.value, "");
});

test("ContentParser: parses emoji sequence", (context: TestContext) => {
    const { node } = parseToken("😀😀😀", (parserContext: ParserContext, valueBuilder: StringBuilder) => valueBuilder.length >= 6);

    context.assert.strictEqual(node.value, "😀😀😀");
});

test("ContentParser: respects moveNext and currentCharacter", (context: TestContext) => {
    const { node, parserContext } = parseToken("xy", (parserContext: ParserContext, valueBuilder: StringBuilder) => valueBuilder.length >= 1);

    context.assert.strictEqual(parserContext.currentCharacter, "y");
});

test("ContentParser: stops at whitespace", (context: TestContext) => {
    const { node } = parseToken("foo bar", (parserContext: ParserContext, valueBuilder: StringBuilder) => parserContext.currentCharacter === " ");

    context.assert.strictEqual(node.value, "foo");
});

test("ContentParser: parses single whitespace character", (context: TestContext) => {
    const { node } = parseToken("   ", (parserContext: ParserContext, valueBuilder: StringBuilder) => valueBuilder.length >= 1);

    context.assert.strictEqual(node.value, " ");
});

test("ContentParser: stops before consuming any input", (context: TestContext) => {
    const { node } = parseToken("zzz", (parserContext: ParserContext, valueBuilder: StringBuilder) => valueBuilder.length === 0);

    context.assert.strictEqual(node.value, "");
});

test("ContentParser: parses very large input efficiently", (context: TestContext) => {
    const largeInput = "a".repeat(10000);
    const { node } = parseToken(largeInput, (parserContext: ParserContext, valueBuilder: StringBuilder) => valueBuilder.length >= 10000);

    context.assert.strictEqual(node.value!.length, 10000);
});

test("ContentParser: stops on non-BMP Unicode", (context: TestContext) => {
    const input = "foo𐍈bar";
    const { node } = parseToken(input, (parserContext: ParserContext, valueBuilder: StringBuilder) => parserContext.peekMultiple(2) === "𐍈");

    context.assert.strictEqual(node.value, "foo");
});

test("ContentParser: stop using both parserContext and valueBuilder", (context: TestContext) => {
    const { node } = parseToken("abc123", (parserContext: ParserContext, valueBuilder: StringBuilder) =>
        valueBuilder.length >= 2 && parserContext.currentCharacter === "c"
    );

    context.assert.strictEqual(node.value, "ab");
});

test("ContentParser: stop at EOF with partial match", (context: TestContext) => {
    const { node } = parseToken("ab", (parserContext: ParserContext, valueBuilder: StringBuilder) =>
        parserContext.currentCharacter === "z"
    );

    context.assert.strictEqual(node.value, "ab");
});

test("ContentParser: handles EOF after exact match", (context: TestContext) => {
    const { node } = parseToken("x", (parserContext: ParserContext, valueBuilder: StringBuilder) =>
        parserContext.currentCharacter === "x"
    );

    context.assert.strictEqual(node.value, "");
});

test("ContentParser: handles EOF after consuming everything", (context: TestContext) => {
    const { node } = parseToken("xyz", (parserContext: ParserContext, valueBuilder: StringBuilder) =>
        valueBuilder.length > 10
    );

    context.assert.strictEqual(node.value, "xyz");
});

test("ContentParser: stops on specific character using context", (context: TestContext) => {
    const { node } = parseToken("abc def", (parserContext: ParserContext, valueBuilder: StringBuilder) =>
        parserContext.currentCharacter === " "
    );

    context.assert.strictEqual(node.value, "abc");
});