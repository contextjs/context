/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { ParserContext } from "../../../src/context/parser-context.js";
import { ScriptParser } from "../../../src/parsers/html/script.parser.js";
import { Source } from "../../../src/sources/source.js";
import { SyntaxNode } from "../../../src/syntax/abstracts/syntax-node.js";
import { ScriptContentSyntaxNode } from "../../../src/syntax/html/scripts/script-content-syntax-node.js";
import { ScriptTagEndSyntaxNode } from "../../../src/syntax/html/scripts/script-tag-end-syntax-node.js";
import { ScriptTagStartSyntaxNode } from "../../../src/syntax/html/scripts/script-tag-start-syntax-node.js";
import { ScriptTagSyntaxNode } from "../../../src/syntax/html/scripts/script-tag-syntax-node.js";
import { TestParser } from "../../_fixtures/parsers-fixtures.js";

function createContext(input: string): ParserContext {
    return new ParserContext(new Source(input), TestParser);
}

test("ScriptParser: simple script block", (context: TestContext) => {
    const parserContext = createContext('<script>console.log(1);</script>');
    const node = ScriptParser.parse(parserContext);

    context.assert.ok(node instanceof ScriptTagSyntaxNode);
    context.assert.ok(node.children[0] instanceof ScriptTagStartSyntaxNode);
    context.assert.ok(node.children[1] instanceof ScriptContentSyntaxNode);
    context.assert.ok(node.children[2] instanceof ScriptTagEndSyntaxNode);
    context.assert.strictEqual((node.children[1] as ScriptContentSyntaxNode).value, 'console.log(1);');
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});

test("ScriptParser: script block with empty content", (context: TestContext) => {
    const parserContext = createContext('<script></script>');
    const node = ScriptParser.parse(parserContext);

    context.assert.strictEqual((node.children[1] as ScriptContentSyntaxNode).value, '');
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});

test("ScriptParser: script block with whitespace content", (context: TestContext) => {
    const parserContext = createContext('<script>  \t  \n</script>');
    const node = ScriptParser.parse(parserContext);

    context.assert.strictEqual((node.children[1] as ScriptContentSyntaxNode).value, '');
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});

test("ScriptParser: script block with unicode content", (context: TestContext) => {
    const parserContext = createContext('<script>let emoji = "😀"; const zh = "名字";</script>');
    const node = ScriptParser.parse(parserContext);

    context.assert.strictEqual((node.children[1] as ScriptContentSyntaxNode).value, 'let emoji = "😀"; const zh = "名字";');
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});

test("ScriptParser: script block with attributes", (context: TestContext) => {
    const parserContext = createContext('<script type="module" defer>console.log(2);</script>');
    const node = ScriptParser.parse(parserContext);

    context.assert.ok(node.children[0] instanceof ScriptTagStartSyntaxNode);
    context.assert.strictEqual((node.children[1] as ScriptContentSyntaxNode).value, 'console.log(2);');
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});

test("ScriptParser: script block with trivia after end", (context: TestContext) => {
    const parserContext = createContext('<script>console.log("x");</script>   \t');
    const node = ScriptParser.parse(parserContext);

    context.assert.ok(node.trivia instanceof SyntaxNode || node.trivia === null);
    context.assert.strictEqual((node.children[1] as ScriptContentSyntaxNode).value, 'console.log("x");');
});

test("ScriptParser: unterminated script block", (context: TestContext) => {
    const parserContext = createContext('<script>console.log(3);');
    const node = ScriptParser.parse(parserContext);

    context.assert.strictEqual((node.children[1] as ScriptContentSyntaxNode).value, 'console.log(3);');
    context.assert.strictEqual(parserContext.diagnostics.length, 2);
    context.assert.match(parserContext.diagnostics[0].message.message, /Expected end/i);
});

test("ScriptParser: missing script end tag", (context: TestContext) => {
    const parserContext = createContext('<script>var x=1');
    const node = ScriptParser.parse(parserContext);

    context.assert.strictEqual((node.children[1] as ScriptContentSyntaxNode).value, 'var x=1');
    context.assert.strictEqual(parserContext.diagnostics.length, 2);
    context.assert.match(parserContext.diagnostics[0].message.message, /Expected end/i);
});

test("ScriptParser: script with leading/trailing/internal whitespace", (context: TestContext) => {
    const parserContext = createContext(' \t<script> var x = 42; </script>  \n');
    const node = ScriptParser.parse(parserContext);

    context.assert.strictEqual((node.children[1] as ScriptContentSyntaxNode).value, 'var x = 42; ');
});

test("ScriptParser: script with comments inside", (context: TestContext) => {
    const parserContext = createContext('<script>// comment\nlet a=1; /* c2 */</script>');
    const node = ScriptParser.parse(parserContext);

    context.assert.strictEqual((node.children[1] as ScriptContentSyntaxNode).value, '// comment\nlet a=1; /* c2 */');
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});

test("ScriptParser: script block with very large content", (context: TestContext) => {
    const bigValue = "let x=0;".repeat(5000);
    const parserContext = createContext(`<script>${bigValue}</script>`);
    const node = ScriptParser.parse(parserContext);

    context.assert.strictEqual((node.children[1] as ScriptContentSyntaxNode).value!.length, bigValue.length);
    context.assert.strictEqual((node.children[1] as ScriptContentSyntaxNode).value, bigValue);
});

test("ScriptParser: script block with emoji, multi-byte, surrogate pairs", (context: TestContext) => {
    const input = '<script>const e = "😃"; const astral = "𐍈"; const zh = "名字";</script>';
    const parserContext = createContext(input);
    const node = ScriptParser.parse(parserContext);

    context.assert.strictEqual((node.children[1] as ScriptContentSyntaxNode).value, 'const e = "😃"; const astral = "𐍈"; const zh = "名字";');
});

test("ScriptParser: missing script start tag", (context: TestContext) => {
    const parserContext = createContext('console.log("no tag");');
    const node = ScriptParser.parse(parserContext);

    context.assert.ok((node.children[0] instanceof ScriptTagStartSyntaxNode) || (parserContext.diagnostics.length > 0));
});

test("ScriptParser: multiple script blocks", (context: TestContext) => {
    const parserContext = createContext('<script>a=1;</script><script>b=2;</script>');
    const node1 = ScriptParser.parse(parserContext);
    const node2 = ScriptParser.parse(parserContext);

    context.assert.strictEqual((node1.children[1] as ScriptContentSyntaxNode).value, 'a=1;');
    context.assert.strictEqual((node2.children[1] as ScriptContentSyntaxNode).value, 'b=2;');
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});

test("ScriptParser: script with all printable ASCII", (context: TestContext) => {
    const chars = Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)).filter(c => c !== '<' && c !== '>' && c !== " ").join('')
    const parserContext = createContext(`<script>${chars}</script>`);
    const node = ScriptParser.parse(parserContext);

    context.assert.strictEqual((node.children[1] as ScriptContentSyntaxNode).value, chars);
});

test("ScriptParser: script with nested fake script marker", (context: TestContext) => {
    const parserContext = createContext('<script>foo <script>bar<script>baz</script>');
    const node = ScriptParser.parse(parserContext);

    context.assert.strictEqual((node.children[1] as ScriptContentSyntaxNode).value, 'foo <script>bar<script>baz');
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});

test("ScriptParser: EOF inside script block", (context: TestContext) => {
    const parserContext = createContext('<script>unfinished');
    const node = ScriptParser.parse(parserContext);

    context.assert.strictEqual((node.children[1] as ScriptContentSyntaxNode).value, 'unfinished');
    context.assert.strictEqual(parserContext.diagnostics.length, 2);
    context.assert.match(parserContext.diagnostics[0].message.message, /Expected end/i);
});
