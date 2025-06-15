/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { ParserContext } from "../../../src/context/parser-context";
import { TSHTMLParser } from "../../../src/parsers/tshtml/tshtml.parser";
import { Source } from "../../../src/sources/source";
import { CommentSyntaxNode } from "../../../src/syntax/common/comment-syntax-node";
import { EndOfFileSyntaxNode } from "../../../src/syntax/common/end-of-file-syntax-node";
import { LiteralSyntaxNode } from "../../../src/syntax/common/literal-syntax-node";
import { CDATASyntaxNode } from "../../../src/syntax/html/cdata/cdata-syntax-node";
import { ScriptTagSyntaxNode } from "../../../src/syntax/html/scripts/script-tag-syntax-node";
import { StyleTagSyntaxNode } from "../../../src/syntax/html/style/style-tag-syntax-node";
import { HtmlTagSyntaxNode } from "../../../src/syntax/html/tags/html-tag-syntax-node";
import { TypescriptCodeValueSyntaxNode } from "../../../src/syntax/tshtml/typescript-code-value-syntax-node";

function parse(text: string) {
    const context = new ParserContext(new Source(text), TSHTMLParser);
    return TSHTMLParser.parse(context);
}

test("TSHTMLParser: parses EOF", (context: TestContext) => {
    const node = parse("");

    context.assert.ok(node instanceof EndOfFileSyntaxNode);
});

test("TSHTMLParser: parses escaped transition (@@) as literal", (context: TestContext) => {
    const node = parse("@@");

    context.assert.ok(node instanceof LiteralSyntaxNode);
    context.assert.strictEqual(node.value, "@");
});

test("TSHTMLParser: parses transition (@) as inline TypeScript", (context: TestContext) => {
    const node = parse("@x") as any;

    context.assert.ok(node.children[1] instanceof TypescriptCodeValueSyntaxNode);
    context.assert.strictEqual(node.children[1].value, "x");
});

test("TSHTMLParser: parses HTML comment", (context: TestContext) => {
    const node = parse("<!-- test -->");

    context.assert.ok(node instanceof CommentSyntaxNode);
    context.assert.strictEqual(node.value, "<!-- test -->");
});

test("TSHTMLParser: parses CDATA block", (context: TestContext) => {
    const node = parse("<![CDATA[abc]]>");

    context.assert.ok(node instanceof CDATASyntaxNode);
    context.assert.strictEqual((node.start as any).value, "<![CDATA[");
});

test("TSHTMLParser: parses <style> tag", (context: TestContext) => {
    const node = parse("<style>h1 { color: red; }</style>");

    context.assert.ok(node instanceof StyleTagSyntaxNode);
    context.assert.strictEqual((node as any).children[0].children[1].children[0].value, "style");
});

test("TSHTMLParser: parses <script> tag", (context: TestContext) => {
    const node = parse("<script>alert(1)</script>");

    context.assert.ok(node instanceof ScriptTagSyntaxNode);
    context.assert.strictEqual((node as any).children[0].children[1].children[0].value, "script");
});

test("TSHTMLParser: parses generic HTML tag", (context: TestContext) => {
    const node = parse("<div>");

    context.assert.ok(node instanceof HtmlTagSyntaxNode);
});

test("TSHTMLParser: parses forward-slash comments as comment", (context: TestContext) => {
    const node = parse("// line comment");

    context.assert.ok(node instanceof CommentSyntaxNode);
    context.assert.strictEqual(node.value, "// line comment");
});

test("TSHTMLParser: parses unknown characters as literal", (context: TestContext) => {
    const node = parse("Hello World");
    
    context.assert.ok(node instanceof LiteralSyntaxNode);
    context.assert.strictEqual(node.value, "Hello World");
});
