/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { ParserContext } from "../../../src/context/parser-context.js";
import { DiagnosticMessages } from "../../../src/diagnostics/diagnostic-messages.js";
import { StyleParser } from "../../../src/parsers/html/style.parser.js";
import { Source } from "../../../src/sources/source.js";
import { SyntaxNode } from "../../../src/syntax/abstracts/syntax-node.js";
import { StyleContentSyntaxNode } from "../../../src/syntax/html/style/style-content-syntax-node.js";
import { StyleTagEndSyntaxNode } from "../../../src/syntax/html/style/style-tag-end-syntax-node.js";
import { StyleTagStartSyntaxNode } from "../../../src/syntax/html/style/style-tag-start-syntax-node.js";
import { StyleTagSyntaxNode } from "../../../src/syntax/html/style/style-tag-syntax-node.js";
import { TestParser } from "../../_fixtures/parsers-fixtures.js";

function createContext(input: string): ParserContext {
    return new ParserContext(new Source(input), TestParser);
}

test("StyleParser: simple style block", (context: TestContext) => {
    const parserContext = createContext('<style>body{color:red;}</style>');
    const node = StyleParser.parse(parserContext);

    context.assert.ok(node instanceof StyleTagSyntaxNode);
    context.assert.ok(node.children[0] instanceof StyleTagStartSyntaxNode);
    context.assert.ok(node.children[1] instanceof StyleContentSyntaxNode);
    context.assert.ok(node.children[2] instanceof StyleTagEndSyntaxNode);
    context.assert.strictEqual((node.children[1] as StyleContentSyntaxNode).value, 'body{color:red;}');
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});

test("StyleParser: style block with empty content", (context: TestContext) => {
    const parserContext = createContext('<style></style>');
    const node = StyleParser.parse(parserContext);

    context.assert.strictEqual((node.children[1] as StyleContentSyntaxNode).value, '');
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});

test("StyleParser: style block with whitespace content, consumed by trivia", (context: TestContext) => {
    const parserContext = createContext('<style>  \t  \n</style>');
    const node = StyleParser.parse(parserContext);

    context.assert.strictEqual((node.children[1] as StyleContentSyntaxNode).value, '');
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});

test("StyleParser: style block with unicode content", (context: TestContext) => {
    const parserContext = createContext('<style>.emoji { content: "😀"; } .zh { font-family: 微软雅黑; }</style>');
    const node = StyleParser.parse(parserContext);

    context.assert.strictEqual((node.children[1] as StyleContentSyntaxNode).value, '.emoji { content: "😀"; } .zh { font-family: 微软雅黑; }');
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});

test("StyleParser: style block with attributes", (context: TestContext) => {
    const parserContext = createContext('<style type="text/css" media="screen">h1{font-size:2em;}</style>');
    const node = StyleParser.parse(parserContext);

    context.assert.ok(node.children[0] instanceof StyleTagStartSyntaxNode);
    context.assert.strictEqual((node.children[1] as StyleContentSyntaxNode).value, 'h1{font-size:2em;}');
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});

test("StyleParser: style block with trivia after end", (context: TestContext) => {
    const parserContext = createContext('<style>body{}</style>   \t');
    const node = StyleParser.parse(parserContext);

    context.assert.ok(node.trivia instanceof SyntaxNode || node.trivia === null);
    context.assert.strictEqual((node.children[1] as StyleContentSyntaxNode).value, 'body{}');
});

test("StyleParser: unterminated style block", (context: TestContext) => {
    const parserContext = createContext('<style>body{color:red;}');
    const node = StyleParser.parse(parserContext);

    context.assert.strictEqual((node.children[1] as StyleContentSyntaxNode).value, 'body{color:red;}');
    context.assert.strictEqual(parserContext.diagnostics.length, 2);
    context.assert.match(parserContext.diagnostics[0].message.message, /Expected end/i);
});

test("StyleParser: missing style end tag", (context: TestContext) => {
    const parserContext = createContext('<style>h1{}');
    const node = StyleParser.parse(parserContext);

    context.assert.strictEqual((node.children[1] as StyleContentSyntaxNode).value, 'h1{}');
    context.assert.strictEqual(parserContext.diagnostics.length, 2);
    context.assert.match(parserContext.diagnostics[0].message.message, /Expected end/i);
});

test("StyleParser: style with trailing/internal whitespace", (context: TestContext) => {
    const parserContext = createContext('<style> .a { } </style>  \n');
    const node = StyleParser.parse(parserContext);

    context.assert.strictEqual((node.children[1] as StyleContentSyntaxNode).value, '.a { } ');
});

test("StyleParser: style with comments inside", (context: TestContext) => {
    const parserContext = createContext('<style>/* comment */ h1 { color: red; } /* c2 */</style>');
    const node = StyleParser.parse(parserContext);

    context.assert.strictEqual((node.children[1] as StyleContentSyntaxNode).value, '/* comment */ h1 { color: red; } /* c2 */');
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});

test("StyleParser: style block with very large content", (context: TestContext) => {
    const bigValue = ".a{c:x;}".repeat(5000);
    const parserContext = createContext(`<style>${bigValue}</style>`);
    const node = StyleParser.parse(parserContext);

    context.assert.strictEqual((node.children[1] as StyleContentSyntaxNode).value!.length, bigValue.length);
    context.assert.strictEqual((node.children[1] as StyleContentSyntaxNode).value, bigValue);
});

test("StyleParser: style block with emoji, multi-byte, surrogate pairs", (context: TestContext) => {
    const input = '<style>.e { c: 😃; astral: 𐍈; zh: 名字; }</style>';
    const parserContext = createContext(input);
    const node = StyleParser.parse(parserContext);

    context.assert.strictEqual((node.children[1] as StyleContentSyntaxNode).value, '.e { c: 😃; astral: 𐍈; zh: 名字; }');
});

test("StyleParser: missing style start tag", (context: TestContext) => {
    const parserContext = createContext('body { color: red; }');
    const node = StyleParser.parse(parserContext);

    context.assert.ok((node.children[0] instanceof StyleTagStartSyntaxNode) || (parserContext.diagnostics.length > 0));
});

test("StyleParser: multiple style blocks", (context: TestContext) => {
    const parserContext = createContext('<style>a{}</style><style>b{}</style>');
    const node1 = StyleParser.parse(parserContext);
    const node2 = StyleParser.parse(parserContext);

    context.assert.strictEqual((node1.children[1] as StyleContentSyntaxNode).value, 'a{}');
    context.assert.strictEqual((node2.children[1] as StyleContentSyntaxNode).value, 'b{}');
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});

test("StyleParser: style with all printable ASCII", (context: TestContext) => {
    const chars = Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)).filter(c => c !== '<' && c !== '>' && c !== " ").join('')
    const parserContext = createContext(`<style>${chars}</style>`);
    const node = StyleParser.parse(parserContext);

    context.assert.strictEqual((node.children[1] as StyleContentSyntaxNode).value, chars);
});

test("StyleParser: EOF inside style block", (context: TestContext) => {
    const parserContext = createContext('<style>unfinished');
    const node = StyleParser.parse(parserContext);

    context.assert.strictEqual((node.children[1] as StyleContentSyntaxNode).value, 'unfinished');
    context.assert.strictEqual(parserContext.diagnostics.length, 2);
    context.assert.match(parserContext.diagnostics[0].message.message, /Expected end/i);
});