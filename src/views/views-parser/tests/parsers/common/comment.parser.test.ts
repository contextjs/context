/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { ParserContext } from "../../../src/context/parser-context.js";
import { CommentParser } from "../../../src/parsers/common/comment.parser.js";
import { Source } from "../../../src/sources/source.js";
import { SyntaxNode } from "../../../src/syntax/abstracts/syntax-node.js";
import { CommentSyntaxNode } from "../../../src/syntax/common/comment-syntax-node.js";
import { TriviaSyntaxNode } from "../../../src/syntax/common/trivia-syntax-node.js";

function createContext(input: string): ParserContext {
    return new ParserContext(new Source(input), null!);
}

test("CommentParser: simple HTML comment", (context: TestContext) => {
    const parserContext = createContext('<!-- This is a comment -->');
    const node = CommentParser.parse(parserContext);

    context.assert.ok(node instanceof CommentSyntaxNode);
    context.assert.strictEqual(node.value, '<!-- This is a comment -->');
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});

test("CommentParser: empty HTML comment", (context: TestContext) => {
    const parserContext = createContext('<!-- -->');
    const node = CommentParser.parse(parserContext);

    context.assert.strictEqual(node.value, '<!-- -->');
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});

test("CommentParser: unterminated HTML comment", (context: TestContext) => {
    const parserContext = createContext('<!-- unterminated');
    const node = CommentParser.parse(parserContext);

    context.assert.ok(node.value!.startsWith('<!-- unterminated'));
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});

test("CommentParser: HTML comment with Unicode", (context: TestContext) => {
    const parserContext = createContext('<!-- 名字 😃 𐍈 -->');
    const node = CommentParser.parse(parserContext);

    context.assert.strictEqual(node.value, '<!-- 名字 😃 𐍈 -->');
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});

test("CommentParser: HTML comment at EOF", (context: TestContext) => {
    const parserContext = createContext('<!-- EOF');
    const node = CommentParser.parse(parserContext);

    context.assert.ok(node.value!.startsWith('<!-- EOF'));
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});

test("CommentParser: simple inline // comment", (context: TestContext) => {
    const parserContext = createContext('// abc');
    const node = CommentParser.parse(parserContext);

    context.assert.ok(node instanceof CommentSyntaxNode);
    context.assert.strictEqual(node.value, '// abc');
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});

test("CommentParser: inline // comment with EOF", (context: TestContext) => {
    const parserContext = createContext('// test');
    const node = CommentParser.parse(parserContext);

    context.assert.strictEqual(node.value, '// test');
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});

test("CommentParser: block /* comment */", (context: TestContext) => {
    const parserContext = createContext('/* hello */');
    const node = CommentParser.parse(parserContext);

    context.assert.ok(node instanceof CommentSyntaxNode);
    context.assert.strictEqual(node.value, '/* hello */');
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});

test("CommentParser: empty block comment", (context: TestContext) => {
    const parserContext = createContext('/**/');
    const node = CommentParser.parse(parserContext);

    context.assert.strictEqual(node.value, '/**/');
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});

test("CommentParser: unterminated block comment", (context: TestContext) => {
    const parserContext = createContext('/* not closed');
    const node = CommentParser.parse(parserContext);

    context.assert.ok(node.value!.startsWith('/* not closed'));
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});

test("CommentParser: block comment with Unicode", (context: TestContext) => {
    const parserContext = createContext('/* 你好 😃 𐍈 */');
    const node = CommentParser.parse(parserContext);

    context.assert.strictEqual(node.value, '/* 你好 😃 𐍈 */');
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});

test("CommentParser: block comment at EOF", (context: TestContext) => {
    const parserContext = createContext('/*');
    const node = CommentParser.parse(parserContext);

    context.assert.ok(node.value!.startsWith('/*'));
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});

test("CommentParser: parse invalid input emits diagnostic", (context: TestContext) => {
    const parserContext = createContext('??');
    const node = CommentParser.parse(parserContext);

    context.assert.strictEqual(node.value, '?');
    context.assert.strictEqual(parserContext.diagnostics.length, 1);
    context.assert.strictEqual(parserContext.diagnostics[0].message.message, "Invalid comment syntax");
});

test("CommentParser: comment is only input", (context: TestContext) => {
    const parserContext = createContext('//');
    const node = CommentParser.parse(parserContext);

    context.assert.strictEqual(node.value, '//');
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});

test("CommentParser: comment with special chars", (context: TestContext) => {
    const parserContext = createContext('<!-- &<> @ -->');
    const node = CommentParser.parse(parserContext);

    context.assert.strictEqual(node.value, '<!-- &<> @ -->');
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});

test("CommentParser: isCommentStart returns true", (context: TestContext) => {
    const ctx1 = createContext('// foo');
    const ctx2 = createContext('/* foo */');
    const ctx3 = createContext('<!-- foo -->');

    context.assert.strictEqual(CommentParser.isCommentStart(ctx1), true);
    context.assert.strictEqual(CommentParser.isCommentStart(ctx2), true);
    context.assert.strictEqual(CommentParser.isCommentStart(ctx3), true);
});

    test("CommentParser: whitespace after comment", (context: TestContext) => {
    const parserContext = createContext('// foo   \n  ');
    const node = CommentParser.parse(parserContext);

    context.assert.strictEqual(node.value, '// foo   ');
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
    context.assert.ok(node.trailingTrivia instanceof TriviaSyntaxNode);
});

test("CommentParser: no trivia after inline comment", (context: TestContext) => {
    const parserContext = createContext('// foo');
    const node = CommentParser.parse(parserContext);

    context.assert.strictEqual(node.value, '// foo');
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("CommentParser: no trivia after block comment", (context: TestContext) => {
    const parserContext = createContext('/* foo */');
    const node = CommentParser.parse(parserContext);

    context.assert.strictEqual(node.value, '/* foo */');
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("CommentParser: no trivia after HTML comment", (context: TestContext) => {
    const parserContext = createContext('<!-- foo -->');
    const node = CommentParser.parse(parserContext);

    context.assert.strictEqual(node.value, '<!-- foo -->');
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
    context.assert.strictEqual(node.trailingTrivia, null);
});

test("CommentParser: block comment with complex trivia", (context: TestContext) => {
    const parserContext = createContext('/*x*/ \t \u00A0\n');
    const node = CommentParser.parse(parserContext);

    context.assert.strictEqual(node.value, '/*x*/');
    context.assert.ok(node.trailingTrivia instanceof TriviaSyntaxNode);
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});

test("CommentParser: empty input is not a comment", (context: TestContext) => {
    const parserContext = createContext('');
    CommentParser.parse(parserContext);

    context.assert.strictEqual(parserContext.diagnostics.length, 1);
});

test("CommentParser: multi-line block comment", (context: TestContext) => {
    const input = "/* line1\nline2\nline3 */";
    const parserContext = createContext(input);
    const node = CommentParser.parse(parserContext);

    context.assert.strictEqual(node.value, input);
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});

test("CommentParser: multi-line HTML comment", (context: TestContext) => {
    const input = "<!-- line1\nline2\nline3 -->";
    const parserContext = createContext(input);
    const node = CommentParser.parse(parserContext);

    context.assert.strictEqual(node.value, input);
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});

test("CommentParser: block comment stops at first non-trivia character", (context: TestContext) => {
    const parserContext = createContext("/* abc */ extra */ ignored */");
    const node = CommentParser.parse(parserContext);

    context.assert.strictEqual(node.value, "/* abc */");
    context.assert.strictEqual(parserContext.currentCharacter, "e");
});

test("CommentParser: HTML comment stops at first non-trivia character", (context: TestContext) => {
    const parserContext = createContext("<!-- abc --> extra --> ignored -->");
    const node = CommentParser.parse(parserContext);

    context.assert.strictEqual(node.value, "<!-- abc -->");
    context.assert.strictEqual(parserContext.currentCharacter, "e");
});

test("CommentParser: unterminated block comment at EOF does not add diagnostic", (context: TestContext) => {
    const parserContext = createContext("/* unterminated");
    const node = CommentParser.parse(parserContext);

    context.assert.ok(node.value!.startsWith("/* unterminated"));
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});

test("CommentParser: inline comment with only newline after", (context: TestContext) => {
    const parserContext = createContext("//abc\n");
    const node = CommentParser.parse(parserContext);

    context.assert.strictEqual(node.value, "//abc");
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
    context.assert.strictEqual(parserContext.currentCharacter, "\x00");
});

test("CommentParser: block comment immediately before EOF", (context: TestContext) => {
    const parserContext = createContext("/* abc */");
    const node = CommentParser.parse(parserContext);

    context.assert.strictEqual(node.value, "/* abc */");
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
    context.assert.strictEqual(parserContext.currentCharacter, "\x00");
});

test("CommentParser: inline comment immediately before EOF", (context: TestContext) => {
    const parserContext = createContext("// abc");
    const node = CommentParser.parse(parserContext);

    context.assert.strictEqual(node.value, "// abc");
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
    context.assert.strictEqual(parserContext.currentCharacter, "\x00");
});