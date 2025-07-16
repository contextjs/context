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
import { TagStartParser } from "../../../../src/parsers/generic/tags/tag-start.parser.js";
import { AttributeSyntaxNode } from "../../../../src/syntax/abstracts/attributes/attribute-syntax-node.js";
import { BracketSyntaxNode } from "../../../../src/syntax/abstracts/bracket-syntax-node.js";
import { TriviaSyntaxNode } from "../../../../src/syntax/common/trivia-syntax-node.js";
import { TestAttributeNameSyntaxNode, TestAttributeSyntaxNode, TestAttributeValueSyntaxNode, TestBracketSyntaxNode, TestParser, TestTagNameSyntaxNode, TestTagStartSyntaxNode } from "../../../_fixtures/parsers-fixtures.js";

function parseTagStart(input: string) {
    const context = new ParserContext(new Source(input), TestParser);
    const result = TagStartParser.parse(
        context,
        (children, leadingTrivia, trailingTrivia) => new TestTagStartSyntaxNode(children, leadingTrivia, trailingTrivia),
        (children, leadingTrivia, trailingTrivia) => new TestTagNameSyntaxNode(children, leadingTrivia, trailingTrivia),
        {
            attributeSyntaxNodeFactory: (children, leadingTrivia, trailingTrivia) => new TestAttributeSyntaxNode(children, leadingTrivia, trailingTrivia),
            attributeNameSyntaxNodeFactory: (children, leadingTrivia, trailingTrivia) => new TestAttributeNameSyntaxNode(children, leadingTrivia, trailingTrivia),
            attributeValueSyntaxNodeFactory: (children, leadingTrivia, trailingTrivia) => new TestAttributeValueSyntaxNode(children, leadingTrivia, trailingTrivia)
        },
        (value, location, leadingTrivia, trailingTrivia) => new TestBracketSyntaxNode(value, location, leadingTrivia, trailingTrivia)
    );

    return { ...result, context };
}

test("TagStartParser: parses basic opening tag", (context: TestContext) => {
    const { tagName, selfClosing, tagStartSyntaxNode } = parseTagStart("<div>");

    context.assert.strictEqual(tagName, "div");
    context.assert.strictEqual(selfClosing, false);
    context.assert.ok(tagStartSyntaxNode.children[0] instanceof BracketSyntaxNode);
    context.assert.strictEqual((tagStartSyntaxNode.children[0] as BracketSyntaxNode).value, "<");
    context.assert.ok(tagStartSyntaxNode.children.at(-1) instanceof BracketSyntaxNode);
    context.assert.strictEqual((tagStartSyntaxNode.children.at(-1) as BracketSyntaxNode).value, ">");
});

test("TagStartParser: parses self-closing tag", (context: TestContext) => {
    const { tagName, selfClosing, tagStartSyntaxNode } = parseTagStart("<br/>");

    context.assert.strictEqual(tagName, "br");
    context.assert.strictEqual(selfClosing, true);
    context.assert.strictEqual((tagStartSyntaxNode.children.at(-1) as BracketSyntaxNode).value, "/>");
});

test("TagStartParser: parses tag with one attribute", (context: TestContext) => {
    const { tagStartSyntaxNode } = parseTagStart('<input type="text">');
    const attrs = tagStartSyntaxNode.children.filter(c => c instanceof AttributeSyntaxNode);
    const attr = attrs[0] as AttributeSyntaxNode;

    context.assert.strictEqual(attrs.length, 1);
    context.assert.strictEqual((attr.children[0] as any).children[0].value, "type");
    context.assert.strictEqual((attr.children[2] as any).children[1].value, "text");
});

test("TagStartParser: parses tag with multiple attributes", (context: TestContext) => {
    const { tagStartSyntaxNode } = parseTagStart('<input type="text" disabled/>');
    const attrs = tagStartSyntaxNode.children.filter(c => c instanceof AttributeSyntaxNode);

    context.assert.strictEqual(attrs.length, 2);
    context.assert.strictEqual((attrs[0].children[0] as any).children[0].value, "type");
    context.assert.strictEqual((attrs[1].children[0] as any).children[0].value, "disabled");
});

test("TagStartParser: emits diagnostic for unexpected EOF", (context: TestContext) => {
    const { context: ctx } = parseTagStart("<input type=\"text\"");

    context.assert.ok(ctx.diagnostics.some(d => d.message.code === DiagnosticMessages.UnexpectedEndOfInput.code));
});

test("TagStartParser: emits diagnostic for missing tag name", (context: TestContext) => {
    const { tagStartSyntaxNode, context: ctx } = parseTagStart("< >");

    context.assert.strictEqual(ctx.diagnostics[1].message.code, DiagnosticMessages.InvalidTagName("<").code);
    context.assert.strictEqual(ctx.diagnostics[1].message.message, DiagnosticMessages.InvalidTagName(">").message);
});

test("TagStartParser: parses tag with trivia after", (context: TestContext) => {
    const { tagStartSyntaxNode } = parseTagStart("<foo>   ");

    context.assert.ok(tagStartSyntaxNode.children[2].trailingTrivia instanceof TriviaSyntaxNode);
    context.assert.strictEqual(tagStartSyntaxNode.children[2].trailingTrivia!.value, "   ");
});

test("TagStartParser: parses tag with equals in attribute value", (context: TestContext) => {
    const { tagStartSyntaxNode } = parseTagStart('<foo a="1=2">');
    const attr = tagStartSyntaxNode.children.find(c => c instanceof AttributeSyntaxNode) as AttributeSyntaxNode;

    context.assert.strictEqual((attr.children[2] as any).children[1].value, "1=2");
});

test("TagStartParser: parses tag with emoji in name", (context: TestContext) => {
    const { tagName } = parseTagStart("<😀>");

    context.assert.strictEqual(tagName, "😀");
});