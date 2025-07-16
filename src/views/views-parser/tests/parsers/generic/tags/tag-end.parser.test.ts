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
import { TagEndParser } from "../../../../src/parsers/generic/tags/tag-end.parser.js";
import { BracketSyntaxNode } from "../../../../src/syntax/abstracts/bracket-syntax-node.js";
import { TagNameSyntaxNode } from "../../../../src/syntax/abstracts/tags/tag-name-syntax-node.js";
import { TriviaSyntaxNode } from "../../../../src/syntax/common/trivia-syntax-node.js";
import { TestBracketSyntaxNode, TestParser, TestTagEndSyntaxNode, TestTagNameSyntaxNode } from "../../../_fixtures/parsers-fixtures.js";

function parseTagEnd(input: string, expected = "div") {
    const context = new ParserContext(new Source(input), TestParser);
    const node = TagEndParser.parse(
        context, 
        expected, 
        (children, leadingTrivia, trailingTrivia) => new TestTagNameSyntaxNode(children, leadingTrivia, trailingTrivia),
        (children, leadingTrivia, trailingTrivia) => new TestTagEndSyntaxNode(children, leadingTrivia, trailingTrivia),
        (value, location, leadingTrivia, trailingTrivia) => new TestBracketSyntaxNode(value, location, leadingTrivia, trailingTrivia)
    );

    return { node, context };
}

test("TagEndParser: parses correct end tag", (context: TestContext) => {
    const { node } = parseTagEnd("</div>");
    context.assert.ok(node instanceof TestTagEndSyntaxNode);

    context.assert.strictEqual((node.children[0] as BracketSyntaxNode).value, "</");
    context.assert.strictEqual(((node.children[1] as TagNameSyntaxNode).children[0] as any).value, "div");
    context.assert.strictEqual((node.children[2] as BracketSyntaxNode).value, ">");
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("TagEndParser: handles trivia after closing tag", (context: TestContext) => {
    const { node } = parseTagEnd("</div>  ");

    context.assert.ok(node.children[2].trailingTrivia instanceof TriviaSyntaxNode);
    context.assert.strictEqual(node.children[2].trailingTrivia!.value, "  ");
});

test("TagEndParser: emits diagnostic on missing closing bracket", (context: TestContext) => {
    const { context: ctx } = parseTagEnd("</div");

    context.assert.ok(ctx.diagnostics.some(d => d.message.code === DiagnosticMessages.UnterminatedTag("div").code));
});

test("TagEndParser: emits diagnostic on mismatched tag name", (context: TestContext) => {
    const { context: ctx } = parseTagEnd("</span>", "div");

    context.assert.ok(ctx.diagnostics.some(d => d.message.code === DiagnosticMessages.MismatchedEndTag("div", "span").code));
});

test("TagEndParser: emits both diagnostics for unterminated and mismatched tag", (context: TestContext) => {
    const { context: ctx } = parseTagEnd("</span", "div");

    context.assert.ok(ctx.diagnostics.some(d => d.message.code === DiagnosticMessages.UnterminatedTag("div").code));
    context.assert.ok(ctx.diagnostics.some(d => d.message.code === DiagnosticMessages.MismatchedEndTag("div", "span").code));
});

test("TagEndParser: parses tag name with dashes and Unicode", (context: TestContext) => {
    const { node } = parseTagEnd("</x-y😀>");
    const tagName = node.children[1] as any;

    context.assert.strictEqual(tagName.children[0].value, "x-y😀");
});
