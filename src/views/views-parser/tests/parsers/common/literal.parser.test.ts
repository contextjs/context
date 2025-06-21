/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { ParserContext } from "../../../src/context/parser-context.js";
import { LiteralParser } from "../../../src/parsers/common/literal.parser.js";
import { TransitionParser } from "../../../src/parsers/common/transition.parser.js";
import { Source } from "../../../src/sources/source.js";
import { EndOfFileSyntaxNode } from "../../../src/syntax/common/end-of-file-syntax-node.js";
import { LiteralSyntaxNode } from "../../../src/syntax/common/literal-syntax-node.js";
import { TestParser } from "../../_fixtures/parsers-fixtures.js";

TransitionParser.isEscapedTransition = (context) => context.peekMultiple(2) === "@@";

function createContext(input: string) {
    return new ParserContext(new Source(input), TestParser);
}

test("LiteralParser: parses plain literal", (context: TestContext) => {
    const parserContext = createContext("foobar");
    const node = LiteralParser.parse(parserContext);

    context.assert.ok(node instanceof LiteralSyntaxNode);
    context.assert.strictEqual(node.value, "foobar");
});

test("LiteralParser: stops on end of file", (context: TestContext) => {
    const parserContext = createContext("");
    const node = LiteralParser.parse(parserContext);

    context.assert.ok(node instanceof LiteralSyntaxNode);
    context.assert.strictEqual(node.value, "");
});

test("LiteralParser: stops at less-than sign", (context: TestContext) => {
    const parserContext = createContext("foo<bar");
    const node = LiteralParser.parse(parserContext);

    context.assert.strictEqual(node.value, "foo");
    context.assert.strictEqual(parserContext.currentCharacter, "<");
});

test("LiteralParser: stops at transition symbol", (context: TestContext) => {
    const parserContext = createContext("foo@bar");
    const node = LiteralParser.parse(parserContext);

    context.assert.strictEqual(node.value, "foo");
    context.assert.strictEqual(parserContext.currentCharacter, "@");
});

test("LiteralParser: handles escaped transition in middle", (context: TestContext) => {
    const parserContext = createContext("foo@@bar");
    const node = LiteralParser.parse(parserContext);

    context.assert.strictEqual(node.value, "foo@bar");
    context.assert.strictEqual(parserContext.currentCharacter, EndOfFileSyntaxNode.endOfFile);
});

test("LiteralParser: handles only transition", (context: TestContext) => {
    const parserContext = createContext("@");
    const node = LiteralParser.parse(parserContext);

    context.assert.strictEqual(node.value, "");
    context.assert.strictEqual(parserContext.currentCharacter, "@");
});

test("LiteralParser: handles only escaped transition", (context: TestContext) => {
    const parserContext = createContext("@@");
    const node = LiteralParser.parse(parserContext);

    context.assert.strictEqual(node.value, "@");
    context.assert.strictEqual(parserContext.currentCharacter, EndOfFileSyntaxNode.endOfFile);
});

test("LiteralParser: handles only less-than", (context: TestContext) => {
    const parserContext = createContext("<");
    const node = LiteralParser.parse(parserContext);

    context.assert.strictEqual(node.value, "");
    context.assert.strictEqual(parserContext.currentCharacter, "<");
});

test("LiteralParser: parses Unicode characters", (context: TestContext) => {
    const parserContext = createContext("💡foo𐍈");
    const node = LiteralParser.parse(parserContext);

    context.assert.strictEqual(node.value, "💡foo𐍈");
});

test("LiteralParser: parses literal ending in whitespace", (context: TestContext) => {
    const parserContext = createContext("abc  ");
    const node = LiteralParser.parse(parserContext);

    context.assert.strictEqual(node.value, "abc  ");
});

test("LiteralParser: parses very large literal efficiently", (context: TestContext) => {
    const large = "x".repeat(10_000);
    const parserContext = createContext(large);
    const node = LiteralParser.parse(parserContext);

    context.assert.strictEqual(node.value!.length, 10_000);
});

test("LiteralParser: does not include trailing @ or <", (context: TestContext) => {
    const parserContext = createContext("abc@");
    const node = LiteralParser.parse(parserContext);

    context.assert.strictEqual(node.value, "abc");
    context.assert.strictEqual(parserContext.currentCharacter, "@");
});

test("LiteralParser: handles literal with embedded @@", (context: TestContext) => {
    const parserContext = createContext("a@@b");
    const node = LiteralParser.parse(parserContext);

    context.assert.strictEqual(node.value, "a@b");
    context.assert.strictEqual(parserContext.currentCharacter, EndOfFileSyntaxNode.endOfFile);
});

test("LiteralParser: handles alternating escaped and unescaped transitions", (context: TestContext) => {
    const parserContext = createContext("ab@@@cd");
    const node = LiteralParser.parse(parserContext);

    context.assert.strictEqual(node.value, "ab@");
    context.assert.strictEqual(parserContext.currentCharacter, "@");
});

test("LiteralParser: does not append EOF after escaped transition at end", (context: TestContext) => {
    const parserContext = createContext("@@");
    const node = LiteralParser.parse(parserContext);

    context.assert.strictEqual(node.value, "@");
    context.assert.strictEqual(parserContext.currentCharacter, EndOfFileSyntaxNode.endOfFile);
});

test("LiteralParser: stops at less-than even after escaped transition", (context: TestContext) => {
    const parserContext = createContext("a@@<b");
    const node = LiteralParser.parse(parserContext);

    context.assert.strictEqual(node.value, "a@");
    context.assert.strictEqual(parserContext.currentCharacter, "<");
});

test("LiteralParser: attaches leading trivia", (context: TestContext) => {
    const parserContext = createContext("   foo");
    const node = LiteralParser.parse(parserContext);

    context.assert.strictEqual(node.value, "foo");
    context.assert.ok(node.leadingTrivia != null && node.leadingTrivia.value === "   ");
});

test("LiteralParser: parses Unicode and escaped transitions", (context: TestContext) => {
    const parserContext = createContext("😀@@😀");
    const node = LiteralParser.parse(parserContext);

    context.assert.strictEqual(node.value, "😀@😀");
});

test("LiteralParser: parses multiple escaped transitions", (context: TestContext) => {
    const parserContext = createContext("@@@@");
    const node = LiteralParser.parse(parserContext);

    context.assert.strictEqual(node.value, "@@");
    context.assert.strictEqual(parserContext.currentCharacter, EndOfFileSyntaxNode.endOfFile);
});

test("LiteralParser: does not infinite loop with trailing escape", (context: TestContext) => {
    const parserContext = createContext("foo@@");
    const node = LiteralParser.parse(parserContext);

    context.assert.strictEqual(node.value, "foo@");
    context.assert.strictEqual(parserContext.currentCharacter, EndOfFileSyntaxNode.endOfFile);
});

test("LiteralParser: parsing a confetti of at-signs", (context: TestContext) => {
    const parserContext = createContext("@@@@🎉@@!!@@@");
    const node = LiteralParser.parse(parserContext);

    context.assert.strictEqual(node.value, "@@🎉@!!@");
    context.assert.strictEqual(parserContext.currentCharacter, "@");
});

test("LiteralParser: handles triple transition, only one escaped", (context: TestContext) => {
    const parserContext = createContext("@@@");
    const node = LiteralParser.parse(parserContext);

    context.assert.strictEqual(node.value, "@");
    context.assert.strictEqual(parserContext.currentCharacter, "@");
});

test("LiteralParser: handles escaped at the end with text", (context: TestContext) => {
    const parserContext = createContext("@@abc");
    const node = LiteralParser.parse(parserContext);

    context.assert.strictEqual(node.value, "@abc");
    context.assert.strictEqual(parserContext.currentCharacter, EndOfFileSyntaxNode.endOfFile);
});

test("LiteralParser: handles unescaped stop after escape", (context: TestContext) => {
    const parserContext = createContext("@@@a");
    const node = LiteralParser.parse(parserContext);

    context.assert.strictEqual(node.value, "@");
    context.assert.strictEqual(parserContext.currentCharacter, "@");
});

test("LiteralParser: handles stop at less-than", (context: TestContext) => {
    const parserContext = createContext("@@<");
    const node = LiteralParser.parse(parserContext);

    context.assert.strictEqual(node.value, "@");
    context.assert.strictEqual(parserContext.currentCharacter, "<");
});

test("LiteralParser: parses multiple escapes and stops", (context: TestContext) => {
    const parserContext = createContext("@@@@a@@@");
    const node = LiteralParser.parse(parserContext);

    context.assert.strictEqual(node.value, "@@a@");
    context.assert.strictEqual(parserContext.currentCharacter, "@");
});

test("LiteralParser: parses escaped in the middle", (context: TestContext) => {
    const parserContext = createContext("abc@@def");
    const node = LiteralParser.parse(parserContext);

    context.assert.strictEqual(node.value, "abc@def");
    context.assert.strictEqual(parserContext.currentCharacter, EndOfFileSyntaxNode.endOfFile);
});

test("LiteralParser: parses escape and then stops at unescaped @", (context: TestContext) => {
    const parserContext = createContext("abc@@@def");
    const node = LiteralParser.parse(parserContext);

    context.assert.strictEqual(node.value, "abc@");
    context.assert.strictEqual(parserContext.currentCharacter, "@");
});

test("LiteralParser: stops at first less-than", (context: TestContext) => {
    const parserContext = createContext("<@@@");
    const node = LiteralParser.parse(parserContext);

    context.assert.strictEqual(node.value, "");
    context.assert.strictEqual(parserContext.currentCharacter, "<");
});
