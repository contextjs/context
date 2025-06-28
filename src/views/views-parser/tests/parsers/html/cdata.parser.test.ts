/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Source } from "@contextjs/views";
import test, { TestContext } from "node:test";
import { ParserContext } from "../../../src/context/parser-context.js";
import { CDATAParser } from "../../../src/parsers/html/cdata.parser.js";
import { TriviaSyntaxNode } from "../../../src/syntax/common/trivia-syntax-node.js";
import { CDATAContentSyntaxNode } from "../../../src/syntax/html/cdata/cdata-content-syntax-node.js";
import { CDATAEndSyntaxNode } from "../../../src/syntax/html/cdata/cdata-end-syntax-node.js";
import { CDATAStartSyntaxNode } from "../../../src/syntax/html/cdata/cdata-start-syntax-node.js";
import { CDATASyntaxNode } from "../../../src/syntax/html/cdata/cdata-syntax-node.js";

function createContext(input: string): ParserContext {
    return new ParserContext(new Source(input), null!);
}

test("CDATAParser: simple CDATA section", (context: TestContext) => {
    const parserContext = createContext('<![CDATA[hello world]]>');
    const node = CDATAParser.parse(parserContext);

    context.assert.ok(node instanceof CDATASyntaxNode);
    context.assert.strictEqual((node.start as CDATAStartSyntaxNode).value, '<![CDATA[');
    context.assert.strictEqual(((node as any).content as CDATAContentSyntaxNode).value, 'hello world');
    context.assert.strictEqual((node.end as CDATAEndSyntaxNode).value, ']]>');
    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, null);
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});

test("CDATAParser: empty CDATA", (context: TestContext) => {
    const parserContext = createContext('<![CDATA[]]>');
    const node = CDATAParser.parse(parserContext);

    context.assert.strictEqual((node as any).content.value, '');
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});

test("CDATAParser: CDATA with only whitespace", (context: TestContext) => {
    const parserContext = createContext('<![CDATA[   ]]>');
    const node = CDATAParser.parse(parserContext);

    context.assert.strictEqual((node as any).content.value, '   ');
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});

test("CDATAParser: CDATA with unicode", (context: TestContext) => {
    const parserContext = createContext('<![CDATA[𝕮𝖔𝖓𝖙𝖊𝖝𝖙𝕁𝕊-名字]]>');
    const node = CDATAParser.parse(parserContext);

    context.assert.strictEqual(((node as any).content as CDATAContentSyntaxNode).value, '𝕮𝖔𝖓𝖙𝖊𝖝𝖙𝕁𝕊-名字');
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});

test("CDATAParser: CDATA with inner ] characters", (context: TestContext) => {
    const parserContext = createContext('<![CDATA[a ] ] b]]>');
    const node = CDATAParser.parse(parserContext);

    context.assert.strictEqual(((node as any).content as CDATAContentSyntaxNode).value, 'a ] ] b');
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});

test("CDATAParser: CDATA with ]]> in content (split)", (context: TestContext) => {
    const parserContext = createContext('<![CDATA[foo ]] >bar]]>');
    const node = CDATAParser.parse(parserContext);

    context.assert.strictEqual(((node as any).content as CDATAContentSyntaxNode).value, 'foo ]] >bar');
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});

test("CDATAParser: CDATA with newlines", (context: TestContext) => {
    const parserContext = createContext('<![CDATA[line1\nline2\r\nline3]]>');
    const node = CDATAParser.parse(parserContext);

    context.assert.strictEqual(((node as any).content as CDATAContentSyntaxNode).value, 'line1\nline2\r\nline3');
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});

test("CDATAParser: missing CDATA start", (context: TestContext) => {
    const parserContext = createContext('Not a CDATA');
    const node = CDATAParser.parse(parserContext);

    context.assert.strictEqual((node as any).value, 'N');
    context.assert.strictEqual(parserContext.diagnostics.length, 1);
    context.assert.strictEqual(parserContext.diagnostics[0].message.message, 'Expected start of the "<![CDATA[" tag.');
});

test("CDATAParser: CDATA with leading/trailing/internal whitespace", (context: TestContext) => {
    const parserContext = createContext('<![CDATA[ foo bar ]]>\t  ');
    const node = CDATAParser.parse(parserContext);

    context.assert.strictEqual(((node as CDATASyntaxNode).start as CDATAStartSyntaxNode).value, '<![CDATA[');
    context.assert.strictEqual(((node as any).content as CDATAContentSyntaxNode).value, ' foo bar ');
    context.assert.strictEqual((node.trailingTrivia instanceof TriviaSyntaxNode), true);
});

test("CDATAParser: multiple CDATA sections", (context: TestContext) => {
    const parserContext = createContext('<![CDATA[a]]><![CDATA[b]]>');
    const node1 = CDATAParser.parse(parserContext);
    const node2 = CDATAParser.parse(parserContext);

    context.assert.strictEqual(((node1 as any).content as CDATAContentSyntaxNode).value, 'a');
    context.assert.strictEqual(((node2 as any).content as CDATAContentSyntaxNode).value, 'b');
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});

test("CDATAParser: very large CDATA content", (context: TestContext) => {
    const bigValue = "x".repeat(50000);
    const parserContext = createContext(`<![CDATA[${bigValue}]]>`);
    const node = CDATAParser.parse(parserContext);

    context.assert.strictEqual(((node as any).content as CDATAContentSyntaxNode).value?.length, 50000);
    context.assert.strictEqual(((node as any).content as CDATAContentSyntaxNode).value, bigValue);
});

test("CDATAParser: CDATA with emoji, multi-byte, and surrogate pairs", (context: TestContext) => {
    const input = '<![CDATA[emoji: 😃, astral: 𐍈, zh: 名字]]>';
    const parserContext = createContext(input);
    const node = CDATAParser.parse(parserContext);

    context.assert.strictEqual(((node as any).content as CDATAContentSyntaxNode).value, 'emoji: 😃, astral: 𐍈, zh: 名字');
});

test("CDATAParser: CDATA with all printable ASCII", (context: TestContext) => {
    const chars = Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)).join('');
    const parserContext = createContext(`<![CDATA[${chars}]]>`);
    const node = CDATAParser.parse(parserContext);

    context.assert.strictEqual(((node as any).content as CDATAContentSyntaxNode).value, chars);
});

test("CDATAParser: missing CDATA end", (context: TestContext) => {
    const parserContext = createContext('<![CDATA[ok');
    const node = CDATAParser.parse(parserContext);

    context.assert.strictEqual(((node as any).content as CDATAContentSyntaxNode).value, 'ok');
    context.assert.strictEqual(parserContext.diagnostics.length, 2);
    context.assert.strictEqual(parserContext.diagnostics[0].message.message, 'Unexpected end of input.');
    context.assert.strictEqual(parserContext.diagnostics[1].message.message, 'Missing CDATA section end (expected "]]>").');
});

test("CDATAParser: CDATA with nested fake CDATA marker", (context: TestContext) => {
    const parserContext = createContext('<![CDATA[foo <![CDATA[bar]]>baz]]>');
    const node = CDATAParser.parse(parserContext);

    context.assert.strictEqual(((node as any).content as CDATAContentSyntaxNode).value, 'foo <![CDATA[bar');
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});

test("CDATAParser: EOF inside CDATA", (context: TestContext) => {
    const parserContext = createContext('<![CDATA[not finished');
    const node = CDATAParser.parse(parserContext);

    context.assert.strictEqual(((node as any).content as CDATAContentSyntaxNode).value, 'not finished');
    context.assert.strictEqual(parserContext.diagnostics.length, 2);
    context.assert.strictEqual(parserContext.diagnostics[0].message.message, 'Unexpected end of input.');
    context.assert.strictEqual(parserContext.diagnostics[1].message.message, 'Missing CDATA section end (expected "]]>").');
});

test("CDATAParser: CDATA immediately followed by text", (context: TestContext) => {
    const parserContext = createContext('<![CDATA[data]]>text');
    const node = CDATAParser.parse(parserContext);

    context.assert.strictEqual(((node as any).content as CDATAContentSyntaxNode).value, 'data');
    context.assert.strictEqual(((node as any).end as CDATAEndSyntaxNode).value, ']]>');
    context.assert.strictEqual(parserContext.peekMultiple(4), 'text');
});

test("CDATAParser: CDATA with no trivia after end", (context: TestContext) => {
    const parserContext = createContext('<![CDATA[foo]]>');
    const node = CDATAParser.parse(parserContext);

    context.assert.strictEqual(node.leadingTrivia, null);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("CDATAParser: CDATA is only input", (context: TestContext) => {
    const parserContext = createContext('<![CDATA[]]>');
    const node = CDATAParser.parse(parserContext);

    context.assert.strictEqual((node as any).content.value, '');
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
    context.assert.strictEqual(parserContext.peekMultiple(1), '');
});

test("CDATAParser: CDATA with unicode trivia after end", (context: TestContext) => {
    const parserContext = createContext('<![CDATA[x]]>\u2003');
    const node = CDATAParser.parse(parserContext);

    context.assert.ok(node.trailingTrivia instanceof TriviaSyntaxNode);
});

test("CDATAParser: unterminated CDATA at EOF", (context: TestContext) => {
    const parserContext = createContext('<![CDATA[');
    const node = CDATAParser.parse(parserContext);

    context.assert.strictEqual(((node as any).content as CDATAContentSyntaxNode).value, '');
    context.assert.strictEqual(parserContext.diagnostics.length, 2);
    context.assert.strictEqual(parserContext.diagnostics[0].message.message, 'Unexpected end of input.');
    context.assert.strictEqual(parserContext.diagnostics[1].message.message, 'Missing CDATA section end (expected "]]>").');
});