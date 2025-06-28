/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { DiagnosticMessages, Source } from "@contextjs/views";
import test, { TestContext } from "node:test";
import { ParserContext } from "../../../src/context/parser-context";
import { HtmlTagParser } from "../../../src/parsers/html/html-tag.parser";
import { HtmlAttributeNameSyntaxNode } from "../../../src/syntax/html/attributes/html-attribute-name-syntax-node";
import { HtmlAttributeSyntaxNode } from "../../../src/syntax/html/attributes/html-attribute-syntax-node";
import { HtmlAttributeValueSyntaxNode } from "../../../src/syntax/html/attributes/html-attribute-value-syntax-node";
import { HtmlTagEndSyntaxNode } from "../../../src/syntax/html/tags/html-tag-end-syntax-node";
import { HtmlTagStartSyntaxNode } from "../../../src/syntax/html/tags/html-tag-start-syntax-node";
import { TestParser } from "../../_fixtures/parsers-fixtures";

function parseHtmlTag(input: string): any {
    const parserContext = new ParserContext(new Source(input), TestParser);
    const node = HtmlTagParser.parse(parserContext);

    return { node, parserContext };
}

function getStartTag(node: any): HtmlTagStartSyntaxNode {
    return node.children[0] as any;
}

function getEndTag(node: any): HtmlTagEndSyntaxNode | null {
    return node.children.length > 1 ? node.children.at(-1) as any : null;
}

function getAttributes(node: any): HtmlAttributeSyntaxNode[] {
    return node.children.filter(c => c instanceof HtmlAttributeSyntaxNode) as HtmlAttributeSyntaxNode[];
}

test("HtmlTagParser: parses simple <div>", (context: TestContext) => {
    const { node } = parseHtmlTag("<div>");
    const start = getStartTag(node);
    const end = getEndTag(node);

    context.assert.ok(start instanceof HtmlTagStartSyntaxNode);
    context.assert.strictEqual(end, null);
});

test("HtmlTagParser: parses <input/> as self-closing", (context: TestContext) => {
    const { node } = parseHtmlTag("<input/>");
    const start = getStartTag(node);

    context.assert.strictEqual(node.children.length, 1);
    context.assert.ok(start.children.some(c => (c as any).value === "/>"));
});

test("HtmlTagParser: parses <div foo=\"bar\">", (context: TestContext) => {
    const { node } = parseHtmlTag('<div foo="bar">');
    const start = getStartTag(node);
    const attrs = getAttributes(start);

    context.assert.strictEqual(attrs.length, 1);
    context.assert.ok(attrs[0].children[0] instanceof HtmlAttributeNameSyntaxNode);
    context.assert.ok(attrs[0].children[2] instanceof HtmlAttributeValueSyntaxNode);
});

test("HtmlTagParser: handles missing end bracket", (context: TestContext) => {
    const { parserContext } = parseHtmlTag('<div foo="bar"');

    context.assert.ok(parserContext.diagnostics.some(d => d.message.code === DiagnosticMessages.UnexpectedEndOfInput.code));
});

test("HtmlTagParser: handles mismatched tag name", (context: TestContext) => {
    const { parserContext } = parseHtmlTag('<div></span>');

    context.assert.ok(parserContext.diagnostics.some(d => d.message.code === DiagnosticMessages.MismatchedEndTag("div", "span").code));
});

test("HtmlTagParser: parses Unicode/emoji in tag", (context: TestContext) => {
    const { node } = parseHtmlTag("<名字😀>");
    const start = getStartTag(node);
    const tagName = start.children[1] as any;

    context.assert.strictEqual(tagName.children[0].value, "名字😀");
});

test("HtmlTagParser: parses attribute with boolean-only name", (context: TestContext) => {
    const { node } = parseHtmlTag("<input disabled>");
    const attr = getAttributes(getStartTag(node))[0] as any;

    context.assert.strictEqual(attr.children[0].children[0].value, "disabled");
    context.assert.strictEqual(attr.children.length, 1);
});

test("HtmlTagParser: parses attribute with transition (@)", (context: TestContext) => {
    const { node } = parseHtmlTag('<foo bar="@baz">');
    const attr = getAttributes(getStartTag(node))[0] as any;

    context.assert.strictEqual(attr.children[2].children[1].transition.value, "@");
});