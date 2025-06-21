/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { ParserContext } from "../../../src/context/parser-context.js";
import { TriviaParser } from "../../../src/parsers/common/trivia.parser.js";
import { Source } from "../../../src/sources/source.js";
import { TriviaSyntaxNode } from "../../../src/syntax/common/trivia-syntax-node.js";
import { TestParser } from "../../_fixtures/parsers-fixtures.js";

function createContext(input: string): ParserContext {
    return new ParserContext(new Source(input), TestParser);
}

test("TriviaParser: parses leading whitespace", (context: TestContext) => {
    const parserContext = createContext('    ');
    const node = TriviaParser.parse(parserContext);

    context.assert.ok(node instanceof TriviaSyntaxNode);
    context.assert.strictEqual((node as any).value, '    ');
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});

test("TriviaParser: parses leading line breaks", (context: TestContext) => {
    const parserContext = createContext('\n\n');
    const node = TriviaParser.parse(parserContext);

    context.assert.ok(node instanceof TriviaSyntaxNode);
    context.assert.strictEqual((node as any).value, '\n\n');
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});

test("TriviaParser: parses leading whitespace and line breaks", (context: TestContext) => {
    const parserContext = createContext('   \n\n ');
    const node = TriviaParser.parse(parserContext);

    context.assert.ok(node instanceof TriviaSyntaxNode);
    context.assert.strictEqual((node as any).value, '   \n\n ');
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});

test("TriviaParser: stops at non-whitespace, non-line break character", (context: TestContext) => {
    const parserContext = createContext('   \n\nfoo');
    const node = TriviaParser.parse(parserContext);

    context.assert.ok(node instanceof TriviaSyntaxNode);
    context.assert.strictEqual((node as any).value, '   \n\n');
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});

test("TriviaParser: parses empty input", (context: TestContext) => {
    const parserContext = createContext('');
    const node = TriviaParser.parse(parserContext);

    context.assert.strictEqual(node, null);
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});

test("TriviaParser: parses only line breaks", (context: TestContext) => {
    const parserContext = createContext('\n\n\n');
    const node = TriviaParser.parse(parserContext);

    context.assert.ok(node instanceof TriviaSyntaxNode);
    context.assert.strictEqual((node as any).value, '\n\n\n');
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});

test("TriviaParser: handles EOF correctly", (context: TestContext) => {
    const parserContext = createContext('   \n\n');
    const node = TriviaParser.parse(parserContext);

    context.assert.ok(node instanceof TriviaSyntaxNode);
    context.assert.strictEqual((node as any).value, '   \n\n');
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});


test("TriviaParser: does not include non-trivia content", (context: TestContext) => {
    const parserContext = createContext('   \n\nfoo');
    const node = TriviaParser.parse(parserContext);

    context.assert.ok(node instanceof TriviaSyntaxNode);
    context.assert.strictEqual((node as any).value, '   \n\n');
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});

test("TriviaParser: parses leading tab", (context: TestContext) => {
    const parserContext = createContext('\t');
    const node = TriviaParser.parse(parserContext);

    context.assert.ok(node instanceof TriviaSyntaxNode);
    context.assert.strictEqual((node as any).value, '\t');
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});

test("TriviaParser: parses mixed whitespace with non-trivia in the middle", (context: TestContext) => {
    const parserContext = createContext('   \n\n   foo bar');
    const node = TriviaParser.parse(parserContext);

    context.assert.ok(node instanceof TriviaSyntaxNode);
    context.assert.strictEqual((node as any).value, '   \n\n   ');
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});

test("TriviaParser: no trivia at the start", (context: TestContext) => {
    const parserContext = createContext('foo bar');
    const node = TriviaParser.parse(parserContext);

    context.assert.strictEqual(node, null);
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});

test("TriviaParser: handles large input", (context: TestContext) => {
    const input = ' '.repeat(10000) + 'foo';
    const parserContext = createContext(input);
    const node = TriviaParser.parse(parserContext);

    context.assert.ok(node instanceof TriviaSyntaxNode);
    context.assert.strictEqual((node as any).value, ' '.repeat(10000));
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});

test("TriviaParser: parses unicode whitespace (non-breaking space, em space, ideographic space)", (context: TestContext) => {
    const unicodeWhitespace = "\u00A0\u2003\u3000";
    const parserContext = createContext(unicodeWhitespace + "foo");
    const node = TriviaParser.parse(parserContext);

    context.assert.ok(node instanceof TriviaSyntaxNode);
    context.assert.strictEqual((node as any).value, unicodeWhitespace);
});

test("TriviaParser: parses a single space", (context: TestContext) => {
    const parserContext = createContext(' ');
    const node = TriviaParser.parse(parserContext);

    context.assert.ok(node instanceof TriviaSyntaxNode);
    context.assert.strictEqual((node as any).value, ' ');
});

test("TriviaParser: parses all types of whitespace", (context: TestContext) => {
    const allWhitespace = " \t\n\r\f\v";
    const parserContext = createContext(allWhitespace + "x");
    const node = TriviaParser.parse(parserContext);

    context.assert.ok(node instanceof TriviaSyntaxNode);
    context.assert.strictEqual((node as any).value, allWhitespace);
});

test("TriviaParser: parses whitespace until EOF", (context: TestContext) => {
    const parserContext = createContext(" \n\t");
    const node = TriviaParser.parse(parserContext);

    context.assert.ok(node instanceof TriviaSyntaxNode);
    context.assert.strictEqual((node as any).value, " \n\t");
});

test("TriviaParser: multiple calls process sequential trivia", (context: TestContext) => {
    const parserContext = createContext("   foo  bar");
    const node1 = TriviaParser.parse(parserContext);
    parserContext.moveNext();
    const node2 = TriviaParser.parse(parserContext);

    context.assert.ok(node1 instanceof TriviaSyntaxNode);
    context.assert.strictEqual((node1 as any).value, "   ");
    context.assert.strictEqual(node2, null);
});

test("TriviaParser: leaves context at first non-trivia character", (context: TestContext) => {
    const parserContext = createContext('  foo');
    TriviaParser.parse(parserContext);

    context.assert.strictEqual(parserContext.currentCharacter, 'f');
});

test("TriviaParser: returns null for non-trivia content", (context: TestContext) => {
    const parserContext = createContext('');
    const node = TriviaParser.parse(parserContext);

    context.assert.strictEqual(node, null);
});

test("TriviaParser: parses exotic Unicode whitespace", (context: TestContext) => {
    const exoticWhitespace = "\u2028\u2029";
    const parserContext = createContext(exoticWhitespace + "x");
    const node = TriviaParser.parse(parserContext)!;

    context.assert.ok(node instanceof TriviaSyntaxNode);
    context.assert.strictEqual(node.value, exoticWhitespace);
    context.assert.strictEqual(parserContext.currentCharacter, "x");
});

test("TriviaParser: parses multiple trivia blocks in one input", (context: TestContext) => {
    const parserContext = createContext("  \n\nfoo\t  bar");

    const node1 = TriviaParser.parse(parserContext);
    context.assert.ok(node1 instanceof TriviaSyntaxNode);
    context.assert.strictEqual(node1.value, "  \n\n");
    context.assert.strictEqual(parserContext.currentCharacter, "f");

    parserContext.moveNext(3);
    const node2 = TriviaParser.parse(parserContext);
    context.assert.ok(node2 instanceof TriviaSyntaxNode);
    context.assert.strictEqual(node2.value, "\t  ");
    context.assert.strictEqual(parserContext.currentCharacter, "b");
});

test("TriviaParser: reset at any position marks correct location", (context: TestContext) => {
    const parserContext = createContext("foo   bar");
    parserContext.moveNext(3);
    const node = TriviaParser.parse(parserContext)!;

    context.assert.strictEqual(node.value, "   ");
    context.assert.strictEqual(node.location.startCharacterIndex, 3);
    context.assert.strictEqual(node.location.endCharacterIndex, 6);
});

test("TriviaParser: node location matches trivia span", (context: TestContext) => {
    const input = '  \n\t ';
    const parserContext = createContext(input);
    const node = TriviaParser.parse(parserContext)!;

    context.assert.strictEqual(node.location.startCharacterIndex, 0);
    context.assert.strictEqual(node.location.startLineIndex, 0);
    context.assert.strictEqual(node.location.endLineIndex, 1);
    context.assert.strictEqual(node.location.startCharacterIndex, 0);
    context.assert.strictEqual(node.location.endCharacterIndex, 2);

});