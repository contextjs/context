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

TransitionParser.transitionSymbol = "@";
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

test("LiteralParser: handles escaped transition", (context: TestContext) => {
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