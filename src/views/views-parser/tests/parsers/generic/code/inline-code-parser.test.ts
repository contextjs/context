/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { DiagnosticMessages, Source } from "@contextjs/views";
import test, { TestContext } from "node:test";
import { ParserContext } from "../../../../src/context/parser-context.js";
import { InlineCodeParser } from "../../../../src/parsers/generic/code/inline-code.parser.js";
import { CodeExpressionSyntaxNode } from "../../../../src/syntax/abstracts/code/code-expression-syntax-node.js";
import { CodeValueSyntaxNode } from "../../../../src/syntax/abstracts/code/code-value-syntax-node.js";
import { TransitionSyntaxNode } from "../../../../src/syntax/common/transition-syntax-node.js";
import { TestCodeExpressionSyntaxNode, TestCodeValueSyntaxNode, TestParser } from "../../../_fixtures/parsers-fixtures.js";

function parseInline(input: string) {
    const parserContext = new ParserContext(new Source(input), TestParser);
    const node = InlineCodeParser.parse(
        parserContext,
        (transition, value, leadingTrivia, trailingTrivia) => new TestCodeExpressionSyntaxNode(transition, value, leadingTrivia, trailingTrivia),
        (children, leadingTrivia, trailingTrivia) => new TestCodeValueSyntaxNode(children, leadingTrivia, trailingTrivia)
    );
    return { node, parserContext };
}

test("InlineCodeParser: parses simple inline code after transition", (context: TestContext) => {
    const { node } = parseInline("@foo");

    context.assert.ok(node instanceof CodeExpressionSyntaxNode);
    context.assert.ok(node.transition instanceof TransitionSyntaxNode);
    context.assert.ok(node.value instanceof CodeValueSyntaxNode);
    context.assert.strictEqual(node.value.value, "foo");
});

test("InlineCodeParser: parses empty inline code after transition", (context: TestContext) => {
    const { node } = parseInline("@");

    context.assert.ok(node instanceof CodeExpressionSyntaxNode);
    context.assert.ok(node.transition instanceof TransitionSyntaxNode);
    context.assert.ok(node.value instanceof CodeValueSyntaxNode);
    context.assert.strictEqual(node.value.value, "");
});

test("InlineCodeParser: parses inline code with emoji", (context: TestContext) => {
    const { node } = parseInline("@😀foo");

    context.assert.ok(node.value instanceof CodeValueSyntaxNode);
    context.assert.strictEqual(node.value.value, "😀foo");
});

test("InlineCodeParser: parses inline code with Unicode", (context: TestContext) => {
    const { node } = parseInline("@名字𐍈");

    context.assert.strictEqual(node.value.value, "名字𐍈");
});

test("InlineCodeParser: stops inline code at whitespace or operator", (context: TestContext) => {
    const { node } = parseInline("@foo bar=baz");

    context.assert.strictEqual(node.value.value, "foo");
});

test("InlineCodeParser: stops inline code at tag", (context: TestContext) => {
    const { node } = parseInline("@foo <div>bar</div>");

    context.assert.strictEqual(node.value.value, "foo");
});

test("InlineCodeParser: handles EOF in inline", (context: TestContext) => {
    const { node, parserContext } = parseInline("@foo");

    context.assert.strictEqual(node.value.value, "foo");
    context.assert.ok(!parserContext.diagnostics.some(d => d.message.code === DiagnosticMessages.UnexpectedEndOfInput.code));
});

test("InlineCodeParser: parses inline code containing a tag start char", (context: TestContext) => {
    const { node } = parseInline("@foo<bar");

    context.assert.strictEqual(node.value.value, "foo");
});