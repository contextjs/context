/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { DiagnosticMessages } from "@contextjs/views";
import test, { TestContext } from "node:test";
import { Language } from "../../src/parsers/language.js";
import { ParserResolver } from "../../src/parsers/parser-resolver.js";
import { Parser } from "../../src/parsers/parser.js";
import { AttributeSyntaxNode } from "../../src/syntax/abstracts/attributes/attribute-syntax-node.js";
import { TagNameSyntaxNode } from "../../src/syntax/abstracts/tags/tag-name-syntax-node.js";
import { TagStartSyntaxNode } from "../../src/syntax/abstracts/tags/tag-start-syntax-node.js";
import { TagSyntaxNode } from "../../src/syntax/abstracts/tags/tag-syntax-node.js";
import { EndOfFileSyntaxNode } from "../../src/syntax/common/end-of-file-syntax-node.js";
import { LiteralSyntaxNode } from "../../src/syntax/common/literal-syntax-node.js";
import { TestParser } from "../_fixtures/parsers-fixtures.js";

function parse(input: string) {
    const originalParserResolve = ParserResolver.resolve;
    ParserResolver.resolve = (() => { return TestParser; });
    const result = Parser.parse(input, Language.TSHTML);

    ParserResolver.resolve = originalParserResolve;
    return result;
}

function getStartTag(node: TagSyntaxNode) {
    return node.children[0] as any;
}

function getAttributes(startTag: TagStartSyntaxNode) {
    return startTag.children.filter(c => c instanceof AttributeSyntaxNode) as any[];
}

test("Parser: empty input returns only EOF node", (context: TestContext) => {
    const result = parse("");

    context.assert.ok(result.nodes.length === 1);
    context.assert.ok(result.nodes[0] instanceof EndOfFileSyntaxNode);
    context.assert.strictEqual(result.diagnostics.length, 0);
});

test("Parser: whitespace only returns literal node with trivia", (context: TestContext) => {
    const result = parse("   \t\r\n  ");

    context.assert.ok(result.nodes[0] instanceof LiteralSyntaxNode);
    context.assert.strictEqual(result.nodes[0].leadingTrivia?.value, "   \t\r\n  ");
    context.assert.strictEqual(result.diagnostics.length, 0);
    context.assert.ok(result.nodes.at(-1) instanceof EndOfFileSyntaxNode);
});

test("Parser: single line literal text", (context: TestContext) => {
    const result = parse("hello world");

    context.assert.ok(result.nodes[0] instanceof LiteralSyntaxNode);
    context.assert.strictEqual(result.nodes[0].value, "hello world");
    context.assert.strictEqual(result.diagnostics.length, 0);
});

test("Parser: multi-line literal text", (context: TestContext) => {
    const result = parse("hello\nworld");

    context.assert.ok(result.nodes[0] instanceof LiteralSyntaxNode);
    context.assert.strictEqual(result.nodes[0].value, "hello\nworld");
    context.assert.strictEqual(result.diagnostics.length, 0);
});

test("Parser: valid simple HTML tag", (context: TestContext) => {
    const result = parse("<div>");
    const node = result.nodes[0] as TagSyntaxNode;
    const startTag = getStartTag(node);

    context.assert.ok(node instanceof TagSyntaxNode);
    context.assert.ok(startTag.children[1] instanceof TagNameSyntaxNode);
    context.assert.strictEqual((startTag.children[1].children[0] as any).value, "div");
    context.assert.strictEqual(result.diagnostics.length, 0);
});

test("Parser: valid custom HTML tag with numeric, dash, and underscore", (context: TestContext) => {
    const result = parse("<custom-123_tag>");
    const node = result.nodes[0] as TagSyntaxNode;
    const startTag = getStartTag(node);

    context.assert.ok(startTag.children[1].children[0].value, "custom-123_tag");
    context.assert.strictEqual(result.diagnostics.length, 0);
});

test("Parser: HTML tag with emoji in name", (context: TestContext) => {
    const result = parse("<emoji😎>");
    const node = result.nodes[0] as TagSyntaxNode;
    const startTag = getStartTag(node);

    context.assert.strictEqual(startTag.children[1].children[0].value, "emoji😎");
    context.assert.strictEqual(result.diagnostics.length, 0);
});

test("Parser: HTML tag with CJK and diacritic", (context: TestContext) => {
    const result = parse("<tést漢字>");
    const node = result.nodes[0] as TagSyntaxNode;
    const startTag = getStartTag(node);

    context.assert.strictEqual(startTag.children[1].children[0].value, "tést漢字");
    context.assert.strictEqual(result.diagnostics.length, 0);
});

test("Parser: HTML tag with attribute", (context: TestContext) => {
    const result = parse('<div foo="bar"></div>');
    const node = result.nodes[0] as TagSyntaxNode;
    const startTag = getStartTag(node);
    const attrs = getAttributes(startTag);

    context.assert.strictEqual(attrs.length, 1);
    context.assert.ok(attrs[0] instanceof AttributeSyntaxNode);
    context.assert.strictEqual((attrs[0] as any).children[0].children[0].value, "foo");
    context.assert.strictEqual((attrs[0] as any).children[2].children[1].value, "bar");
    context.assert.strictEqual(result.diagnostics.length, 0);
});

test("Parser: HTML tag with multiple attributes and emoji", (context: TestContext) => {
    const result = parse('<div a="1" 😊="yes" b_2="foo"></div>');
    const node = result.nodes[0] as TagSyntaxNode;
    const startTag = getStartTag(node);
    const attrs = getAttributes(startTag);
    context.assert.strictEqual(attrs.length, 3);

    context.assert.strictEqual((attrs[1] as any).children[0].children[0].value, "😊");
    context.assert.strictEqual((attrs[1] as any).children[2].children[1].value, "yes");
    context.assert.strictEqual(result.diagnostics.length, 0);
});

test("Parser: self-closing HTML tag", (context: TestContext) => {
    const result = parse("<img />");
    const node = result.nodes[0] as TagSyntaxNode;
    const startTag = getStartTag(node);

    context.assert.strictEqual(startTag.children.at(-1).value, "/>");
    context.assert.strictEqual(result.diagnostics.length, 0);
});

test("Parser: nested HTML tags", (context: TestContext) => {
    const result = parse("<div><span>Text</span></div>");
    const node = result.nodes[0] as TagSyntaxNode;
    const startTag = getStartTag(node);
    const childTag = node.children.find(c => c instanceof TagSyntaxNode && c !== startTag) as TagSyntaxNode;
    const childStartTag = getStartTag(childTag);

    context.assert.ok(childTag instanceof TagSyntaxNode);
    context.assert.strictEqual(childStartTag.children[1].children[0].value, "span");
    context.assert.strictEqual(result.diagnostics.length, 0);
});

test("Parser: literal text before and after tag", (context: TestContext) => {
    const result = parse("before <b>bold</b> after");

    context.assert.ok(result.nodes[0] instanceof LiteralSyntaxNode);
    context.assert.ok(result.nodes[1] instanceof TagSyntaxNode);
    context.assert.ok(result.nodes[2] instanceof LiteralSyntaxNode);
    context.assert.strictEqual(result.diagnostics.length, 0);
});

test("Parser: tag with attribute value containing unicode and emoji", (context: TestContext) => {
    const result = parse('<div data="foo😀漢字"></div>');
    const node = result.nodes[0] as TagSyntaxNode;
    const startTag = getStartTag(node);
    const attrs = getAttributes(startTag);

    context.assert.strictEqual(attrs[0].children[2].children[1].value, "foo😀漢字");
    context.assert.strictEqual(result.diagnostics.length, 0);
});

test("Parser: tag name is numeric only (should fail, emits diagnostic)", (context: TestContext) => {
    const result = parse("<123>");

    context.assert.ok(result.diagnostics.length > 0);
    context.assert.strictEqual(result.diagnostics[0].message.code, DiagnosticMessages.InvalidTagName("123").code);
    context.assert.strictEqual(result.diagnostics[0].message.message, DiagnosticMessages.InvalidTagName("123").message);
});

test("Parser: tag with invalid attribute syntax", (context: TestContext) => {
    const result = parse('<div foo=></div>');

    context.assert.ok(result.diagnostics.length > 0);
});

test("Parser: tag with unclosed attribute quote (unterminated)", (context: TestContext) => {
    const result = parse('<div foo="bar></div>');

    context.assert.ok(result.diagnostics.length > 0);
    context.assert.strictEqual(result.diagnostics[0].message.code, DiagnosticMessages.UnterminatedAttributeValue.code);
    context.assert.strictEqual(result.diagnostics[0].message.message, DiagnosticMessages.UnterminatedAttributeValue.message);
});

test("Parser: unclosed tag (unterminated)", (context: TestContext) => {
    const result = parse("<div");

    context.assert.ok(result.diagnostics.length > 0);
});

test("Parser: self-closing tag without space (valid in HTML5)", (context: TestContext) => {
    const result = parse("<hr/>");
    const node = result.nodes[0] as TagSyntaxNode;
    const startTag = getStartTag(node);

    context.assert.strictEqual(startTag.children.at(-1).value, "/>");
    context.assert.strictEqual(result.diagnostics.length, 0);
});

test("Parser: mixed text and self-closing tag", (context: TestContext) => {
    const result = parse("foo <hr/> bar");

    context.assert.ok(result.nodes[0] instanceof LiteralSyntaxNode);
    context.assert.ok(result.nodes[1] instanceof TagSyntaxNode);
    context.assert.ok(result.nodes[2] instanceof LiteralSyntaxNode);
    context.assert.strictEqual(result.diagnostics.length, 0);
});

test("Parser: only '<' character", (context: TestContext) => {
    const result = parse("<");

    context.assert.ok(result.diagnostics.length > 0);
});

test("Parser: only '>' character", (context: TestContext) => {
    const result = parse(">");

    context.assert.ok(result.nodes[0] instanceof LiteralSyntaxNode);
    context.assert.ok(result.diagnostics.length === 0);
});

test("Parser: only '/' character", (context: TestContext) => {
    const result = parse("/");

    context.assert.ok(result.nodes[0] instanceof LiteralSyntaxNode);
    context.assert.ok(result.diagnostics.length === 0);
});

test("Parser: mixed trivia and empty tag", (context: TestContext) => {
    const result = parse("  < >  ");

    context.assert.ok(result.diagnostics.length === 2);
    context.assert.strictEqual(result.diagnostics[1].message.code, DiagnosticMessages.InvalidTagName("<").code);
});

test("Parser: simple @identifier transition", (context: TestContext) => {
    const result = parse("@foo");
    const transitionGroup = result.nodes[0] as any;
    const atNode = transitionGroup.transition;
    const fooNode = transitionGroup.value;

    context.assert.strictEqual(atNode.value, "@");
    context.assert.strictEqual(fooNode.value, "foo");
    context.assert.ok(result.nodes.at(-1) instanceof EndOfFileSyntaxNode);
    context.assert.strictEqual(result.diagnostics.length, 0);
});

test("Parser: @ transition with Unicode identifier", (context: TestContext) => {
    const result = parse("@😀");
    const transitionGroup = result.nodes[0] as any;
    const atNode = transitionGroup.transition;
    const emojiNode = transitionGroup.value;

    context.assert.strictEqual(atNode.value, "@");
    context.assert.strictEqual(emojiNode.value, "😀");
    context.assert.strictEqual(result.diagnostics.length, 0);
});

test("Parser: @ transition with underscore", (context: TestContext) => {
    const result = parse("@_private");
    const transitionGroup = result.nodes[0] as any;
    const atNode = transitionGroup.transition;
    const identNode = transitionGroup.value;

    context.assert.strictEqual(atNode.value, "@");
    context.assert.strictEqual(identNode.value, "_private");
    context.assert.strictEqual(result.diagnostics.length, 0);
});

test("Parser: simple code block @{ ... }", (context: TestContext) => {
    const result = parse("@{ let x = 1; }");
    const group = result.nodes[0] as any;

    context.assert.strictEqual(group.transition.value, "@");
    context.assert.strictEqual(group.openingBrace.value, "{");
    context.assert.strictEqual(group.closingBrace.value, "}");
    context.assert.strictEqual(result.diagnostics.length, 0);
});

test("Parser: code block with Unicode and emoji", (context: TestContext) => {
    const result = parse("@{ let x = '😎漢字'; }");
    const group = result.nodes[0] as any;

    context.assert.strictEqual(group.transition.value, "@");
    context.assert.strictEqual(group.openingBrace.value, "{");
    context.assert.strictEqual(group.closingBrace.value, "}");
    context.assert.strictEqual(result.diagnostics.length, 0);
});

test("Parser: inline transition in text", (context: TestContext) => {
    const result = parse("hi @foo");
    const literal = result.nodes[0] as LiteralSyntaxNode;
    const transitionGroup = result.nodes[1] as any;

    context.assert.strictEqual(literal.value, "hi ");
    context.assert.strictEqual(transitionGroup.transition.value, "@");
    context.assert.strictEqual(transitionGroup.value.value, "foo");
    context.assert.strictEqual(result.diagnostics.length, 0);
});

test("Parser: transition inside HTML", (context: TestContext) => {
    const result = parse("<div>@bar</div>");
    const tagNode = result.nodes[0] as any;
    const transitionGroup = tagNode.children[1];

    context.assert.strictEqual(transitionGroup.transition.value, "@");
    context.assert.strictEqual(transitionGroup.value.value, "bar");
    context.assert.strictEqual(result.diagnostics.length, 0);
});

test("Parser: code block inside HTML", (context: TestContext) => {
    const result = parse("<div>@{ let a = 2; }</div>");
    const tagNode = result.nodes[0] as any;
    const group = tagNode.children[1];

    context.assert.strictEqual(group.transition.value, "@");
    context.assert.strictEqual(group.openingBrace.value, "{");
    context.assert.strictEqual(group.closingBrace.value, "}");
    context.assert.strictEqual(result.diagnostics.length, 0);
});

test("Parser: multiple transitions in one input", (context: TestContext) => {
    const result = parse("@foo and @bar");
    const group1 = result.nodes[0] as any;
    const literal = result.nodes[1] as LiteralSyntaxNode;
    const group2 = result.nodes[2] as any;

    context.assert.strictEqual(group1.transition.value, "@");
    context.assert.strictEqual(group1.value.value, "foo");
    context.assert.strictEqual(literal.value, "and ");
    context.assert.strictEqual(group2.transition.value, "@");
    context.assert.strictEqual(group2.value.value, "bar");
    context.assert.strictEqual(result.diagnostics.length, 0);
});

test("Parser: multiple code blocks in one input", (context: TestContext) => {
    const result = parse("@{ let x = 1; } and @{ let y = 2; }");
    const group1 = result.nodes[0] as any;
    const literal = result.nodes[1] as LiteralSyntaxNode;
    const group2 = result.nodes[2] as any;

    context.assert.strictEqual(group1.transition.value, "@");
    context.assert.strictEqual(group1.openingBrace.value, "{");
    context.assert.strictEqual(group1.closingBrace.value, "}");
    context.assert.strictEqual(literal.value, "and ");
    context.assert.strictEqual(group2.transition.value, "@");
    context.assert.strictEqual(group2.openingBrace.value, "{");
    context.assert.strictEqual(group2.closingBrace.value, "}");
    context.assert.strictEqual(result.diagnostics.length, 0);
});

test("Parser: transition at start, middle, end", (context: TestContext) => {
    const result = parse("@foo bar @baz @qux");
    const group1 = result.nodes[0] as any;
    const literal1 = result.nodes[1] as LiteralSyntaxNode;
    const group2 = result.nodes[2] as any;
    const group3 = result.nodes[3] as any;

    context.assert.strictEqual(group1.transition.value, "@");
    context.assert.strictEqual(group1.value.value, "foo");
    context.assert.strictEqual(literal1.value, "bar ");
    context.assert.strictEqual(group2.transition.value, "@");
    context.assert.strictEqual(group2.value.value, "baz");
    context.assert.strictEqual(group3.transition.value, "@");
    context.assert.strictEqual(group3.value.value, "qux");
    context.assert.strictEqual(result.diagnostics.length, 0);
});

test("Parser: lone @ is not diagnostic", (context: TestContext) => {
    const result = parse("@");
    const transitionGroup = result.nodes[0] as any;

    context.assert.strictEqual(transitionGroup.transition.value, "@");
    context.assert.ok(result.diagnostics.length === 0);
});

test("Parser: @@ double as literal", (context: TestContext) => {
    const result = parse("@@");

    context.assert.strictEqual((result.nodes[0] as any).value, "@");
});

test("Parser: unterminated code block", (context: TestContext) => {
    const result = parse("@{ let x = 1;");
    const group = result.nodes[0] as any;

    context.assert.strictEqual(group.transition.value, "@");
    context.assert.strictEqual(group.openingBrace.value, "{");
    context.assert.ok(result.diagnostics.length > 0);
});

test("Parser: transition in attribute value", (context: TestContext) => {
    const result = parse('<div foo="@bar"></div>');
    const tag = result.nodes[0] as any;
    const startTag = tag.children[0];
    const attr = startTag.children[2];
    const attrValue = attr.children[2];
    const group = attrValue.children[1];

    context.assert.strictEqual(group.transition.value, "@");
    context.assert.strictEqual(group.value.value, "bar");
    context.assert.strictEqual(result.diagnostics.length, 0);
});

test("Parser: HTML comment with literal before and after", (context: TestContext) => {
    const result = parse("before <!-- comment --> after");
    const literal1 = result.nodes[0] as LiteralSyntaxNode;
    const comment = result.nodes[1] as any;
    const literal2 = result.nodes[2] as LiteralSyntaxNode;

    context.assert.strictEqual(literal1.value, "before ");
    context.assert.strictEqual(comment.value, "<!-- comment -->");
    context.assert.strictEqual(literal2.value, "after");
    context.assert.strictEqual(result.diagnostics.length, 0);
});

test("Parser: HTML comment inside tag content", (context: TestContext) => {
    const result = parse("<div><!--x--></div>");
    const tag = result.nodes[0] as any;
    const comment = tag.children[1];

    context.assert.strictEqual(comment.value, "<!--x-->");
    context.assert.strictEqual(result.diagnostics.length, 0);
});

test("Parser: trivia before and after tag", (context: TestContext) => {
    const result = parse("  <b>hi</b>  ");
    const literal1 = result.nodes[0] as LiteralSyntaxNode;
    const tag = result.nodes[1] as any;
    const literal2 = result.nodes[2] as LiteralSyntaxNode;
    context.assert.strictEqual(literal1.leadingTrivia?.value, "  ");
    context.assert.strictEqual(tag.children[0].children[1].children[0].value, "b");
    context.assert.strictEqual(result.diagnostics.length, 0);
});

test("Parser: EOF in the middle of tag", (context: TestContext) => {
    const result = parse("<div");
    const tag = result.nodes[0] as any;

    context.assert.strictEqual(tag.children[0].children[1].children[0].value, "div");
    context.assert.ok(result.diagnostics.length > 0);
});

test("Parser: EOF in the middle of attribute", (context: TestContext) => {
    const result = parse('<div foo=');
    const tag = result.nodes[0] as any;
    const startTag = tag.children[0];
    const attr = startTag.children[2];

    context.assert.strictEqual(attr.children[0].children[0].value, "foo");
    context.assert.ok(result.diagnostics.length > 0);
});

test("Parser: EOF in the middle of attribute value", (context: TestContext) => {
    const result = parse('<div foo="bar');
    const tag = result.nodes[0] as any;
    const startTag = tag.children[0];
    const attr = startTag.children[2];

    context.assert.strictEqual(attr.children[0].children[0].value, "foo");
    context.assert.ok(result.diagnostics.length > 0);
});

test("Parser: EOF in the middle of code block", (context: TestContext) => {
    const result = parse("@{ let x = 1;");
    const group = result.nodes[0] as any;

    context.assert.strictEqual(group.transition.value, "@");
    context.assert.strictEqual(group.openingBrace.value, "{");
    context.assert.ok(result.diagnostics.length > 0);
});

test("Parser: EOF in the middle of comment", (context: TestContext) => {
    const result = parse("<!-- comment");
    const comment = result.nodes[0] as any;
    context.assert.strictEqual(comment.value, "<!-- comment");
    context.assert.ok(result.diagnostics.length === 0);
});


test("Parser: invalid tag emits diagnostic and recovers", (context: TestContext) => {
    const result = parse("<div <span></span>");
    context.assert.ok(result.diagnostics.length > 0);
    const tag = result.nodes[0] as any;

    context.assert.strictEqual(tag.children[1].children[0].children[1].children[0].value, "span");
    context.assert.strictEqual(result.diagnostics[0].message.code, DiagnosticMessages.InvalidTagFormat.code);
    context.assert.strictEqual(result.diagnostics[0].message.message, DiagnosticMessages.InvalidTagFormat.message);
});

test("Parser: invalid attribute emits diagnostic and recovers", (context: TestContext) => {
    const result = parse('<@div foo= bar="ok"></@div>');
    context.assert.ok(result.diagnostics.length > 0);
    const tag = result.nodes[0] as any;
    const startTag = tag.children[0];
    const attr2 = startTag.children[2];

    context.assert.strictEqual(result.diagnostics[1].message.code, DiagnosticMessages.InvalidName.code);
    context.assert.strictEqual(result.diagnostics[1].message.message, DiagnosticMessages.InvalidName.message);
});

test("Parser: unterminated attribute quote emits diagnostic", (context: TestContext) => {
    const result = parse('<div foo="bar></div>');

    context.assert.ok(result.diagnostics.length > 0);
});

test("Parser: unterminated tag emits diagnostic", (context: TestContext) => {
    const result = parse("<div");

    context.assert.ok(result.diagnostics.length > 0);
});

test("Parser: unterminated code block emits diagnostic", (context: TestContext) => {
    const result = parse("@{ let x = 1;");

    context.assert.ok(result.diagnostics.length > 0);
});

test("Parser: recovers after error to parse subsequent nodes", (context: TestContext) => {
    const result = parse('<div foo="bar> <span>ok</span>');
    const div = result.nodes[0] as any;

    context.assert.ok(result.diagnostics.length > 0);
    context.assert.strictEqual(div.children[0].children[1].children[0].value, "div");
});

test("Parser: diagnostics contain code, message, location", (context: TestContext) => {
    const result = parse('<div foo="bar>');
    const diag = result.diagnostics[0];

    context.assert.ok(typeof diag.message.code === "number");
    context.assert.ok(typeof diag.message.message === "string");
    context.assert.ok(typeof diag.location === "object");
});

test("Parser: only @ character", (context: TestContext) => {
    const result = parse("@");
    const group = result.nodes[0] as any;

    context.assert.strictEqual(group.transition.value, "@");
    context.assert.ok(result.diagnostics.length === 0);
});

test("Parser: only < character", (context: TestContext) => {
    const result = parse("<");

    context.assert.ok(result.diagnostics.length > 0);
});

test("Parser: only > character", (context: TestContext) => {
    const result = parse(">");
    const literal = result.nodes[0] as LiteralSyntaxNode;

    context.assert.strictEqual(literal.value, ">");
    context.assert.strictEqual(result.diagnostics.length, 0);
});

test("Parser: only = character", (context: TestContext) => {
    const result = parse("=");
    const literal = result.nodes[0] as LiteralSyntaxNode;

    context.assert.strictEqual(literal.value, "=");
    context.assert.strictEqual(result.diagnostics.length, 0);
});

test("Parser: only / character", (context: TestContext) => {
    const result = parse("/");
    const literal = result.nodes[0] as LiteralSyntaxNode;

    context.assert.strictEqual(literal.value, "/");
    context.assert.strictEqual(result.diagnostics.length, 0);
});

test("Parser: only emoji", (context: TestContext) => {
    const result = parse("😀");
    const literal = result.nodes[0] as LiteralSyntaxNode;

    context.assert.strictEqual(literal.value, "😀");
    context.assert.strictEqual(result.diagnostics.length, 0);
});

test("Parser: only combining mark", (context: TestContext) => {
    const result = parse("\u0301");
    const literal = result.nodes[0] as LiteralSyntaxNode;

    context.assert.strictEqual(literal.value, "\u0301");
    context.assert.strictEqual(result.diagnostics.length, 0);
});

test("Parser: only CJK character", (context: TestContext) => {
    const result = parse("漢");
    const literal = result.nodes[0] as LiteralSyntaxNode;

    context.assert.strictEqual(literal.value, "漢");
    context.assert.strictEqual(result.diagnostics.length, 0);
});

test("Parser: well-formed script tag", (context: TestContext) => {
    const result = parse("<script>var x = 1;</script>");
    const tag = result.nodes[0] as any;

    context.assert.strictEqual(tag.children[0].children[1].children[0].value, "script");
    context.assert.strictEqual(result.diagnostics.length, 0);
});

test("Parser: well-formed HTML comment", (context: TestContext) => {
    const result = parse("<!-- ok -->");
    const comment = result.nodes[0] as any;

    context.assert.strictEqual(comment.value, "<!-- ok -->");
    context.assert.strictEqual(result.diagnostics.length, 0);
});

test("Parser: malformed HTML comment (unclosed)", (context: TestContext) => {
    const result = parse("<!-- not closed");
    const comment = result.nodes[0] as any;

    context.assert.strictEqual(comment.value, "<!-- not closed");
    context.assert.ok(result.diagnostics.length === 0);
});

test("Parser: escaped transition @@", (context: TestContext) => {
    const result = parse("@@");
    const group = result.nodes[0] as any;

    context.assert.strictEqual(group.value, "@");
});

test("Parser: malformed transition @{", (context: TestContext) => {
    const result = parse("@{");
    const group = result.nodes[0] as any;

    context.assert.strictEqual(group.transition.value, "@");
    context.assert.strictEqual(group.openingBrace.value, "{");
    context.assert.ok(result.diagnostics.length > 0);
});

test("Parser: malformed transition @}", (context: TestContext) => {
    const result = parse("@}");
    const group = result.nodes[0] as any;

    context.assert.strictEqual(group.transition.value, "@");
    context.assert.strictEqual(group.value.value, "}");
    context.assert.ok(result.diagnostics.length === 0);
});

test("Parser: transition with embedded tag", (context: TestContext) => {
    const result = parse("<div style='color: red;'>@foo</div>");
    const group = result.nodes[0] as any;

    context.assert.strictEqual(group.children[1].transition.value, "@");
    context.assert.strictEqual(group.children[0].children[1].children[0].value, "div");
});

test("Parser: unknown language throws or errors", (context: TestContext) => {
    let threw = false;
    try {
        Parser.parse("<div></div>", "unknown" as any);
    }
    catch {
        threw = true;
    }

    context.assert.strictEqual(threw, true);
});

test("Parser: tag with style", (context: TestContext) => {
    const result = parse("<div style=\"color: #000\"></div>");
    const group = result.nodes[0] as any;

    context.assert.strictEqual(group.children[1].transition.value, "@");
    context.assert.strictEqual(group.children[0].children[1].children[0].value, "div");
});