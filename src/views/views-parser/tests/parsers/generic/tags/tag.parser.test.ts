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
import { TagParser } from "../../../../src/parsers/generic/tags/tag.parser.js";
import { AttributeSyntaxNode } from "../../../../src/syntax/abstracts/attributes/attribute-syntax-node.js";
import { BracketSyntaxNode } from "../../../../src/syntax/abstracts/bracket-syntax-node.js";
import { SyntaxNode } from "../../../../src/syntax/abstracts/syntax-node.js";
import { TagNameSyntaxNode } from "../../../../src/syntax/abstracts/tags/tag-name-syntax-node.js";
import { TagSyntaxNode } from "../../../../src/syntax/abstracts/tags/tag-syntax-node.js";
import { TriviaSyntaxNode } from "../../../../src/syntax/common/trivia-syntax-node.js";
import {
    TestAttributeNameSyntaxNode,
    TestAttributeSyntaxNode,
    TestAttributeValueSyntaxNode,
    TestBracketSyntaxNode,
    TestTagEndSyntaxNode,
    TestTagNameSyntaxNode,
    TestTagParser,
    TestTagStartSyntaxNode,
    TestTagSyntaxNode
} from "../../../_fixtures/parsers-fixtures.js";
import { EndOfFileSyntaxNode } from "../../../../src/syntax/common/end-of-file-syntax-node.js";

class TestCodeParser {
    public static parse(context: ParserContext): SyntaxNode {
        context.moveNext();
        return new TriviaSyntaxNode("@", null!);
    }
}

function parseTag(input: string) {
    const parserContext = new ParserContext(new Source(input), TestCodeParser);
    const node = TestTagParser.parse(parserContext);
    return { node, parserContext };
}

function getStartTag(node: TagSyntaxNode) {
    return node.children[0] as any;
}

function getEndTag(node: TagSyntaxNode) {
    return node.children.length > 1 ? node.children.at(-1) as any : null;
}

function getAttributes(startTag: TestTagStartSyntaxNode) {
    return startTag.children.filter(c => c instanceof TestAttributeSyntaxNode) as any[];
}

test("TagParser: parses simple opening tag", (context: TestContext) => {
    const { node } = parseTag("<div>");
    const startTag = getStartTag(node);
    const endTag = getEndTag(node);

    context.assert.ok(startTag instanceof TestTagStartSyntaxNode);
    context.assert.strictEqual((startTag.children[0] as any).value, "<");
    context.assert.ok(startTag.children[1] instanceof TestTagNameSyntaxNode);
    context.assert.strictEqual(endTag, null);
});

test("TagParser: parses tag with trivia after closing", (context: TestContext) => {
    const { node } = parseTag("<div>   ") as any;

    context.assert.ok(node.children[0].children[2].trailingTrivia instanceof TriviaSyntaxNode);
    context.assert.strictEqual(node.children[0].children[2].trailingTrivia!.value, "   ");
});

test("TagParser: parses self-closing tag", (context: TestContext) => {
    const { node } = parseTag("<input/>");
    const startTag = getStartTag(node);

    context.assert.strictEqual((startTag.children[0] as any).value, "<");
    context.assert.ok(startTag.children[1] instanceof TagNameSyntaxNode);
    context.assert.strictEqual((startTag.children.at(-1) as any).value, "/>");
    context.assert.strictEqual(node.children.length, 1);
});

test("TagParser: parses self-closing tag with whitespace before '/>'", (context: TestContext) => {
    const { node } = parseTag("<input />");
    const startTag = getStartTag(node);

    context.assert.strictEqual((startTag.children.at(-1) as any).value, "/>");
});

test("TagParser: parses tag with one attribute", (context: TestContext) => {
    const { node } = parseTag('<div foo="bar">');
    const startTag = getStartTag(node);
    const attrNode = getAttributes(startTag)[0];

    context.assert.ok(attrNode instanceof AttributeSyntaxNode);
    context.assert.strictEqual((attrNode.children[0] as any).children[0].value, "foo");
    context.assert.strictEqual((attrNode.children[2] as any).children[1].value, "bar");
});

test("TagParser: parses tag with multiple attributes and mixed whitespace", (context: TestContext) => {
    const { node } = parseTag('<div a="1"   b = "2" c=3>');
    const startTag = getStartTag(node);
    const attrs = getAttributes(startTag);

    context.assert.strictEqual(attrs.length, 3);
    context.assert.strictEqual((attrs[0].children[0] as any).children[0].value, "a");
    context.assert.strictEqual((attrs[1].children[0] as any).children[0].value, "b");
    context.assert.strictEqual((attrs[2].children[0] as any).children[0].value, "c");
    context.assert.strictEqual((attrs[2].children[2] as any).children[0].value, "3");
});

test("TagParser: parses attribute with only name (no equals, no value)", (context: TestContext) => {
    const { node } = parseTag("<div foo>");
    const startTag = getStartTag(node);
    const attrs = getAttributes(startTag);

    context.assert.strictEqual(attrs.length, 1);
    context.assert.strictEqual((attrs[0].children[0] as any).children[0].value, "foo");
    context.assert.strictEqual(attrs[0].children.length, 1);
});

test("TagParser: parses attribute with only equals", (context: TestContext) => {
    const { node } = parseTag("<div = >");
    const startTag = getStartTag(node);
    const attrs = getAttributes(startTag);

    context.assert.strictEqual(attrs.length, 1);
});

test("TagParser: preserves whitespace as trivia between attributes", (context: TestContext) => {
    const { node } = parseTag('<div foo="a"   bar="b" >');
    const startTag = getStartTag(node);
    const attrs = getAttributes(startTag);

    context.assert.strictEqual(startTag.children[1].trailingTrivia instanceof TriviaSyntaxNode, true);
});

test("TagParser: parses tag name with dashes and colons", (context: TestContext) => {
    const { node } = parseTag("<foo-bar:baz>");
    const startTag = getStartTag(node);

    context.assert.strictEqual(startTag.children[1].children[0].value, "foo-bar:baz");
});

test("TagParser: parses tag name with Unicode and emoji", (context: TestContext) => {
    const { node } = parseTag("<名字😀>");
    const startTag = getStartTag(node);

    context.assert.strictEqual(startTag.children[1].children[0].value, "名字😀");
});

test("TagParser: parses tag name with whitespace after", (context: TestContext) => {
    const { node } = parseTag("<foo   >");
    const startTag = getStartTag(node);

    context.assert.strictEqual(startTag.children[1].children[0].value, "foo");
    context.assert.strictEqual((startTag.children.at(-1) as any).value, ">");
});

test("TagParser: tag name stops at equals", (context: TestContext) => {
    const { node } = parseTag("<foo=bar>");
    const startTag = getStartTag(node);

    context.assert.strictEqual(startTag.children[1].children[0].value, "foo");
});

test("TagParser: emits diagnostic for missing closing bracket", (context: TestContext) => {
    const { parserContext } = parseTag("<div foo='bar'");

    context.assert.ok(parserContext.diagnostics.some(d => d.message.code === DiagnosticMessages.UnexpectedEndOfInput.code));
});

test("TagParser: emits diagnostic for missing tag name", (context: TestContext) => {
    const { node, parserContext } = parseTag("< >");

    context.assert.strictEqual(parserContext.diagnostics[1].message.code, DiagnosticMessages.InvalidTagName("<").code);
    context.assert.strictEqual(parserContext.diagnostics[1].message.message, DiagnosticMessages.InvalidTagName(">").message);
});

test("TagParser: emits diagnostic for unexpected EOF", (context: TestContext) => {
    const { parserContext } = parseTag("<div foo='bar'");

    context.assert.ok(parserContext.diagnostics.some(d => d.message.code === DiagnosticMessages.UnexpectedEndOfInput.code));
});

test("TagParser: emits diagnostic for invalid tag format", (context: TestContext) => {
    const { parserContext } = parseTag("<div foo='bar' ???");
    context.assert.ok(parserContext.diagnostics.some(d => d.message.code === DiagnosticMessages.UnexpectedEndOfInput.code));
});

test("TagParser: attaches trivia after closing bracket", (context: TestContext) => {
    const { node } = parseTag("<div>  ") as any;

    context.assert.ok(node.children[0].children[2].trailingTrivia instanceof TriviaSyntaxNode);
    context.assert.strictEqual(node.children[0].children[2].trailingTrivia!.value, "  ");
});

test("TagParser: attaches no trivia if none present", (context: TestContext) => {
    const { node } = parseTag("<div>");

    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("TagParser: parser can be called repeatedly", (context: TestContext) => {
    const src = "<foo a='1'/><bar b='2'/>";
    const parserContext = new ParserContext(new Source(src), TestCodeParser);
    const node1 = TagParser.parse(
        parserContext,
        (context, tagName) => context.currentCharacter === EndOfFileSyntaxNode.endOfFile,
        (children, leadingTrivia, trailingTrivia) => new TestTagSyntaxNode(children, leadingTrivia, trailingTrivia),
        (children, leadingTrivia, trailingTrivia) => new TestTagNameSyntaxNode(children, leadingTrivia, trailingTrivia),
        (children, leadingTrivia, trailingTrivia) => new TestTagStartSyntaxNode(children, leadingTrivia, trailingTrivia),
        (children, leadingTrivia, trailingTrivia) => new TestTagEndSyntaxNode(children, leadingTrivia, trailingTrivia),
        {
            attributeSyntaxNodeFactory: (children, leadingTrivia, trailingTrivia) => new TestAttributeSyntaxNode(children, leadingTrivia, trailingTrivia),
            attributeNameSyntaxNodeFactory: (children, leadingTrivia, trailingTrivia) => new TestAttributeNameSyntaxNode(children, leadingTrivia, trailingTrivia),
            attributeValueSyntaxNodeFactory: (children, leadingTrivia, trailingTrivia) => new TestAttributeValueSyntaxNode(children, leadingTrivia, trailingTrivia)
        },
        (value, location, leadingTrivia, trailingTrivia) => new TestBracketSyntaxNode(value, location, leadingTrivia, trailingTrivia)
    );
    const node2 = TagParser.parse(
        parserContext,
        (context, tagName) => context.currentCharacter === EndOfFileSyntaxNode.endOfFile,
        (children, leadingTrivia, trailingTrivia) => new TestTagSyntaxNode(children, leadingTrivia, trailingTrivia),
        (children, leadingTrivia, trailingTrivia) => new TestTagNameSyntaxNode(children, leadingTrivia, trailingTrivia),
        (children, leadingTrivia, trailingTrivia) => new TestTagStartSyntaxNode(children, leadingTrivia, trailingTrivia),
        (children, leadingTrivia, trailingTrivia) => new TestTagEndSyntaxNode(children, leadingTrivia, trailingTrivia),
        {
            attributeSyntaxNodeFactory: (children, leadingTrivia, trailingTrivia) => new TestAttributeSyntaxNode(children, leadingTrivia, trailingTrivia),
            attributeNameSyntaxNodeFactory: (children, leadingTrivia, trailingTrivia) => new TestAttributeNameSyntaxNode(children, leadingTrivia, trailingTrivia),
            attributeValueSyntaxNodeFactory: (children, leadingTrivia, trailingTrivia) => new TestAttributeValueSyntaxNode(children, leadingTrivia, trailingTrivia)
        },
        (value, location, leadingTrivia, trailingTrivia) => new TestBracketSyntaxNode(value, location, leadingTrivia, trailingTrivia)
    );

    context.assert.strictEqual(getStartTag(node1).children[1].children[0].value, "foo");
    context.assert.strictEqual(getStartTag(node2).children[1].children[0].value, "bar");
});

test("TagParser: parses tag with only opening bracket", (context: TestContext) => {
    const { node, parserContext } = parseTag("<");
    const startTag = getStartTag(node);

    context.assert.strictEqual(startTag.children.length, 1);
    context.assert.strictEqual(parserContext.diagnostics[0].message.code, DiagnosticMessages.UnexpectedEndOfInput.code);
    context.assert.strictEqual(parserContext.diagnostics[1].message.code, DiagnosticMessages.InvalidTagName("<").code);
});

test("TagParser: parses tag with only opening bracket and trivia", (context: TestContext) => {
    const { node } = parseTag("<  ") as any;

    context.assert.ok(node.children[0].children[0].trailingTrivia?.value, "  ");
});

test("TagParser: parses tag with attribute value containing '>'", (context: TestContext) => {
    const { node } = parseTag('<foo a="1>2">');
    const startTag = getStartTag(node);
    const attr = getAttributes(startTag)[0];

    context.assert.ok(attr.children[2].children[1].value.includes(">"));
});

test("TagParser: parses self-closing tag with trivia after", (context: TestContext) => {
    const { node } = parseTag("<img/>  ") as any;

    context.assert.ok(node.children[0].children[2].trailingTrivia instanceof TriviaSyntaxNode);
    context.assert.strictEqual(node.children[0].children[2].trailingTrivia!.value, "  ");
});

test("TagParser: parses self-closing tag with attributes", (context: TestContext) => {
    const { node } = parseTag('<input type="text" disabled/>');
    const startTag = getStartTag(node);
    const attrs = getAttributes(startTag);

    context.assert.strictEqual(attrs.length, 2);
    context.assert.strictEqual(attrs[0].children[0].children[0].value, "type");
    context.assert.strictEqual(attrs[1].children[0].children[0].value, "disabled");
});

test("TagParser: handles attribute with no value (boolean)", (context: TestContext) => {
    const { node } = parseTag('<input disabled>');
    const startTag = getStartTag(node);
    const attr = getAttributes(startTag)[0];

    context.assert.strictEqual(attr.children[0].children[0].value, "disabled");
    context.assert.strictEqual(attr.children.length, 1);
});

test("TagParser: handles tag with trivia between bracket and tag name", (context: TestContext) => {
    const { node } = parseTag('<   foo>');
    const startTag = getStartTag(node);

    context.assert.strictEqual(startTag.children[1].children[0].value, "foo");
});

test("TagParser: parses tag with attribute value containing equals", (context: TestContext) => {
    const { node } = parseTag('<foo a="x=y=z">');
    const startTag = getStartTag(node);
    const attr = getAttributes(startTag)[0];

    context.assert.strictEqual(attr.children[2].children[1].value, "x=y=z");
});

test("TagParser: handles tag with attributes and weird chars in names", (context: TestContext) => {
    const { node } = parseTag('<foo $a="1" _b="2" c-d="3">');
    const startTag = getStartTag(node);
    const attrs = getAttributes(startTag);

    context.assert.strictEqual(attrs[0].children[0].children[0].value, "$a");
    context.assert.strictEqual(attrs[1].children[0].children[0].value, "_b");
    context.assert.strictEqual(attrs[2].children[0].children[0].value, "c-d");
});

test("TagParser: parses tag with unicode whitespace between name and attributes", (context: TestContext) => {
    const { node } = parseTag('<foo\u2003bar="baz">');
    const startTag = getStartTag(node);
    const attrs = getAttributes(startTag);

    context.assert.strictEqual(startTag.children[1].children[0].value, "foo");
    context.assert.strictEqual(attrs[0].children[0].children[0].value, "bar");
});

test("TagParser: handles attribute with empty value", (context: TestContext) => {
    const { node } = parseTag('<foo bar="">');
    const startTag = getStartTag(node);
    const attr = getAttributes(startTag)[0];

    context.assert.strictEqual(attr.children[2].children.length, 3);
    context.assert.strictEqual(attr.children[2].children[0].value, '"');
    context.assert.strictEqual(attr.children[2].children[1].value, '');
    context.assert.strictEqual(attr.children[2].children[2].value, '"');
});

test("TagParser: parses tag with attribute containing transitions (e.g. @)", (context: TestContext) => {
    const { node } = parseTag('<foo bar="@baz">');
    const startTag = getStartTag(node);
    const openBracket = startTag.children[0] as any;
    const tagName = startTag.children[1] as any;
    const attribute = startTag.children[2] as any;
    const attributeName = attribute.children[0] as any;
    const equals = attribute.children[1] as any;
    const attributeValue = attribute.children[2] as any;
    const transition = attributeValue.children[1] as any;

    context.assert.ok(openBracket instanceof BracketSyntaxNode);
    context.assert.strictEqual(openBracket.value, "<");
    context.assert.strictEqual(tagName.children[0].value, "foo");
    context.assert.ok(attribute instanceof AttributeSyntaxNode);
    context.assert.strictEqual(attributeName.children[0].value, "bar");
    context.assert.strictEqual(equals.value, "=");
    context.assert.strictEqual(attributeValue.children[0].value, '"');
    context.assert.strictEqual(transition.value, "@");
});

test("TagParser: isValidTag accepts basic HTML tags", (context: TestContext) => {
    context.assert.strictEqual(TagParser.isValidTag("<div>"), true);
    context.assert.strictEqual(TagParser.isValidTag("<span>"), true);
    context.assert.strictEqual(TagParser.isValidTag("<a>"), true);
});

test("TagParser: isValidTag accepts tags with attributes", (context: TestContext) => {
    context.assert.strictEqual(TagParser.isValidTag('<div id="x" class="y">'), true);
    context.assert.strictEqual(TagParser.isValidTag('<input type="text" disabled>'), true);
    context.assert.strictEqual(TagParser.isValidTag('<img src="foo.jpg" />'), true);
});

test("TagParser: isValidTag accepts custom elements and namespaces", (context: TestContext) => {
    context.assert.strictEqual(TagParser.isValidTag("<my-component>"), true);
    context.assert.strictEqual(TagParser.isValidTag("<foo:bar>"), true);
    context.assert.strictEqual(TagParser.isValidTag("<svg:g>"), true);
    context.assert.strictEqual(TagParser.isValidTag("<_customTag123>"), true);
    context.assert.strictEqual(TagParser.isValidTag("<a1-b2.c3:d4>"), true);
});

test("TagParser: isValidTag accepts self-closing tags", (context: TestContext) => {
    context.assert.strictEqual(TagParser.isValidTag("<br/>"), true);
    context.assert.strictEqual(TagParser.isValidTag("<hr />"), true);
    context.assert.strictEqual(TagParser.isValidTag('<custom-tag data-x="1"/>'), true);
});

test("TagParser: isValidTag rejects closing tags", (context: TestContext) => {
    context.assert.strictEqual(TagParser.isValidTag("</div>"), false);
    context.assert.strictEqual(TagParser.isValidTag("</my-component>"), false);
    context.assert.strictEqual(TagParser.isValidTag("</svg:g>"), false);
});

test("TagParser: isValidTag handles whitespace and edge cases", (context: TestContext) => {
    context.assert.strictEqual(TagParser.isValidTag(" <div> "), true);
    context.assert.strictEqual(TagParser.isValidTag(" <div id='x'> "), true);
    context.assert.strictEqual(TagParser.isValidTag("<div\t>"), true);
    context.assert.strictEqual(TagParser.isValidTag("< div >"), false);
    context.assert.strictEqual(TagParser.isValidTag(""), false);
    context.assert.strictEqual(TagParser.isValidTag("no-tag"), false);
});

test("TagParser: isValidTag allows dash, dot, colon, underscore in tag names", (context: TestContext) => {
    context.assert.strictEqual(TagParser.isValidTag("<foo-bar_baz:qux.quux>"), true);
    context.assert.strictEqual(TagParser.isValidTag("<foo-bar123.baz:qux>"), true);
    context.assert.strictEqual(TagParser.isValidTag("<foo.bar:baz_qux>"), true);
    context.assert.strictEqual(TagParser.isValidTag("<foo.bar-baz:qux>"), true);
});

test("TagParser: isValidTag rejects doctype and comments", (context: TestContext) => {
    context.assert.strictEqual(TagParser.isValidTag("<!DOCTYPE html>"), false);
    context.assert.strictEqual(TagParser.isValidTag("<!-- comment -->"), false);
});

test("TagParser: isValidTag rejects tags with invalid names", (context: TestContext) => {
    context.assert.strictEqual(TagParser.isValidTag("<123abc>"), false);
    context.assert.strictEqual(TagParser.isValidTag("<>"), false);
    context.assert.strictEqual(TagParser.isValidTag("<!DOCTYPE html>"), false);
    context.assert.strictEqual(TagParser.isValidTag("< foo>"), false);
    context.assert.strictEqual(TagParser.isValidTag("<>"), false);
    context.assert.strictEqual(TagParser.isValidTag("< >"), false);
    context.assert.strictEqual(TagParser.isValidTag("< >"), false);
});

test("TagParser: parses tag with escaped quotes in attribute value", (context: TestContext) => {
    const { node } = parseTag('<input value="He said \\"hi\\"."/>');
    const startTag = getStartTag(node);
    const attr = getAttributes(startTag)[0];

    context.assert.strictEqual(attr.children[2].children[1].value, 'He said \\"hi\\".');
});