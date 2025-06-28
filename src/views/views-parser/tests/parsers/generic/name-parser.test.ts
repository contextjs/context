/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { DiagnosticMessages, Source } from "@contextjs/views";
import test, { TestContext } from "node:test";
import { ParserContext } from "../../../src/context/parser-context.js";
import { TransitionParser } from "../../../src/parsers/common/transition.parser.js";
import { NameParser } from "../../../src/parsers/generic/name.parser.js";
import { NameSyntaxNode } from "../../../src/syntax/abstracts/name-syntax-node.js";
import { SyntaxNode } from "../../../src/syntax/abstracts/syntax-node.js";
import { LiteralSyntaxNode } from "../../../src/syntax/common/literal-syntax-node.js";
import { TransitionSyntaxNode } from "../../../src/syntax/common/transition-syntax-node.js";

class TestNameNode extends NameSyntaxNode { }
const originalIsEscapedTransition = TransitionParser.isEscapedTransition;
const TestRootParser = {
    parse(context: ParserContext): SyntaxNode {
        const start = context.currentPosition;
        context.moveNext();
        return new TransitionSyntaxNode("TS", context.getLocation(start));
    }
};

function createNameContext(input: string, parser: { parse(context: ParserContext): SyntaxNode } = TestRootParser) {
    return new ParserContext(new Source(input), parser);
}

function parseName(input: string, shouldStop: (context: ParserContext) => boolean, parser = TestRootParser) {
    const parserContext = createNameContext(input, parser);
    return NameParser.parse(parserContext, TestNameNode, shouldStop);
}

function parseNameWithContext(input: string, shouldStop: (context: ParserContext) => boolean, parser = TestRootParser) {
    const parserContext = createNameContext(input, parser);
    const node = NameParser.parse(parserContext, TestNameNode, shouldStop);
    return { node, parserContext };
}

test.afterEach(() => {
    TransitionParser.isEscapedTransition = originalIsEscapedTransition;
});

test("NameParser: parses single ASCII name", (context: TestContext) => {
    const node = parseName("foo", c => c.currentCharacter === ">" || c.currentCharacter === "/");

    context.assert.strictEqual(node.children.length, 1);
    context.assert.strictEqual((node.children[0] as LiteralSyntaxNode).value, "foo");
});

test("NameParser: parses multi-character name", (context: TestContext) => {
    const node = parseName("fooBar123", c => c.currentCharacter === ">");

    context.assert.strictEqual((node.children[0] as LiteralSyntaxNode).value, "fooBar123");
});

test("NameParser: empty input triggers diagnostic", (context: TestContext) => {
    const parserContext = createNameContext("");
    const node = NameParser.parse(parserContext, TestNameNode, c => c.currentCharacter === ">");

    context.assert.strictEqual(node.children.length, 0);
    context.assert.strictEqual(parserContext.diagnostics.length, 1);
    context.assert.strictEqual(parserContext.diagnostics[0].message.code, DiagnosticMessages.UnexpectedEndOfInput.code);
    context.assert.strictEqual(parserContext.diagnostics[0].message.message, DiagnosticMessages.UnexpectedEndOfInput.message);
});

test("NameParser: only whitespace triggers diagnostic", (context: TestContext) => {
    const parserContext = createNameContext("     ");
    const node = NameParser.parse(parserContext, TestNameNode, c => c.currentCharacter === ">");

    context.assert.strictEqual(node.children.length, 1);
    context.assert.strictEqual(parserContext.diagnostics.length, 1);
    context.assert.strictEqual(parserContext.diagnostics[0].message.code, DiagnosticMessages.UnexpectedEndOfInput.code);
    context.assert.strictEqual(parserContext.diagnostics[0].message.message, DiagnosticMessages.UnexpectedEndOfInput.message);
});

test("NameParser: stops at stop character", (context: TestContext) => {
    const node = parseName("foo=bar", c => c.currentCharacter === "=");

    context.assert.strictEqual(node.children.length, 1);
    context.assert.strictEqual((node.children[0] as LiteralSyntaxNode).value, "foo");
});

test("NameParser: stops at whitespace", (context: TestContext) => {
    const node = parseName("foo bar", c => c.currentCharacter === " ");

    context.assert.strictEqual((node.children[0] as LiteralSyntaxNode).value, "foo");
});

test("NameParser: stops at custom chars", (context: TestContext) => {
    const node = parseName("foo=bar]", c => c.currentCharacter === "=" || c.currentCharacter === "]");

    context.assert.strictEqual((node.children[0] as LiteralSyntaxNode).value, "foo");
});

test("NameParser: supports Unicode", (context: TestContext) => {
    const node = parseName("名字-𐍈", c => c.currentCharacter === ">");

    context.assert.strictEqual((node.children[0] as LiteralSyntaxNode).value, "名字-𐍈");
});

test("NameParser: supports emoji", (context: TestContext) => {
    const node = parseName("foo😃bar", c => c.currentCharacter === ">");

    context.assert.strictEqual((node.children[0] as LiteralSyntaxNode).value, "foo😃bar");
});

test("NameParser: parses with escaped transition (@@)", (context: TestContext) => {
    const node = parseName("foo@@bar", c => c.currentCharacter === ">");

    context.assert.strictEqual(node.children.length, 1);
    context.assert.strictEqual((node.children[0] as LiteralSyntaxNode).value, "foo@bar");
});

test("NameParser: escaped transition at start (@@foo)", (context: TestContext) => {
    const node = parseName("@@foo", c => c.currentCharacter === ">");

    context.assert.strictEqual(node.children.length, 1);
    context.assert.strictEqual((node.children[0] as LiteralSyntaxNode).value, "@foo");
});

test("NameParser: transition at end", (context: TestContext) => {
    const node = parseName("foo@", c => c.currentCharacter === ">");
    context.assert.strictEqual(node.children.length, 2);
    context.assert.strictEqual((node.children[0] as LiteralSyntaxNode).value, "foo");
    context.assert.strictEqual((node.children[1] as LiteralSyntaxNode).value, "TS");
});

test("NameParser: escaped transition at end (foo@@)", (context: TestContext) => {
    const node = parseName("foo@@", c => c.currentCharacter === ">");
    context.assert.strictEqual(node.children.length, 1);
    context.assert.strictEqual((node.children[0] as LiteralSyntaxNode).value, "foo@");
});

test("NameParser: sequence with mixed transitions and escapes", (context: TestContext) => {
    const node = parseName("foo@bar@@baz@qux", c => c.currentCharacter === ">");

    context.assert.ok(node.children.length >= 1);
    context.assert.strictEqual((node.children[0] as LiteralSyntaxNode).value, "foo");
    context.assert.strictEqual((node.children[1] as TransitionSyntaxNode).value, "TS");
    context.assert.strictEqual((node.children[2] as LiteralSyntaxNode).value, "bar@baz");
    context.assert.strictEqual((node.children[3] as TransitionSyntaxNode).value, "TS");
    context.assert.strictEqual((node.children[4] as LiteralSyntaxNode).value, "qux");
});

test("NameParser: parses with only transition (@)", (context: TestContext) => {
    const node = parseName("@", c => c.currentCharacter === ">");

    context.assert.strictEqual(node.children.length, 1);
    context.assert.strictEqual((node.children[0] as LiteralSyntaxNode).value, "TS");
});

test("NameParser: parses only escaped transition (@@)", (context: TestContext) => {
    const node = parseName("@@", c => c.currentCharacter === ">");

    context.assert.strictEqual(node.children.length, 1);
    context.assert.strictEqual((node.children[0] as LiteralSyntaxNode).value, "@");
});

test("NameParser: parses long Unicode name", (context: TestContext) => {
    const long = "名字".repeat(100);
    const node = parseName(long, c => c.currentCharacter === ">");

    context.assert.strictEqual((node.children[0] as LiteralSyntaxNode).value, long);
});

test("NameParser: parses large ASCII name", (context: TestContext) => {
    const big = "a".repeat(10000);
    const node = parseName(big, c => c.currentCharacter === ">");

    context.assert.strictEqual((node.children[0] as LiteralSyntaxNode).value!.length, 10000);
});

test("NameParser: stops at EOF and emits diagnostic", (context: TestContext) => {
    const { node, parserContext } = parseNameWithContext("foo", c => false);

    context.assert.strictEqual(node.children.length, 1);
    context.assert.strictEqual((node.children[0] as LiteralSyntaxNode).value, "foo");
    context.assert.strictEqual(parserContext.diagnostics.length, 1);
    context.assert.ok(parserContext.diagnostics[0].message.code === DiagnosticMessages.UnexpectedEndOfInput.code);
    context.assert.ok(parserContext.diagnostics[0].message.message === DiagnosticMessages.UnexpectedEndOfInput.message);
});

test("NameParser: parses attribute-like names (stops at =)", (context: TestContext) => {
    const node = parseName("foo=", c => c.currentCharacter === "=");

    context.assert.strictEqual((node.children[0] as LiteralSyntaxNode).value, "foo");
});

test("NameParser: parses attribute-like names (stops at ] or /)", (context: TestContext) => {
    const node = parseName("foo]bar", c => c.currentCharacter === "]" || c.currentCharacter === "/");

    context.assert.strictEqual((node.children[0] as LiteralSyntaxNode).value, "foo");
});

test("NameParser: stops at whitespace if predicate so defined", (context: TestContext) => {
    const node = parseName("foo bar", c => c.currentCharacter === " ");

    context.assert.strictEqual((node.children[0] as LiteralSyntaxNode).value, "foo");
});

test("NameParser: parser advances context", (context: TestContext) => {
    const parserContext = createNameContext("foo bar");

    NameParser.parse(parserContext, TestNameNode, c => c.currentCharacter === " ");
    context.assert.strictEqual(parserContext.currentCharacter, "b");
});

test("NameParser: parses names with dashes, colons, and dots", (context: TestContext) => {
    const node = parseName("foo-bar:baz.qux", c => c.currentCharacter === ">");

    context.assert.strictEqual((node.children[0] as LiteralSyntaxNode).value, "foo-bar:baz.qux");
});

test("NameParser: only stop char returns error", (context: TestContext) => {
    const parserContext = createNameContext("=");
    const node = NameParser.parse(parserContext, TestNameNode, c => c.currentCharacter === "=");

    context.assert.strictEqual(parserContext.diagnostics.some(d => d.message.code === DiagnosticMessages.InvalidName.code), true);
    context.assert.strictEqual(node.children.length, 0);
});

test("NameParser: only transition char returns error or TS node", (context: TestContext) => {
    const parserContext = createNameContext("@");
    const node = NameParser.parse(parserContext, TestNameNode, c => c.currentCharacter === ">");

    context.assert.ok(node.children.length === 1 || node.children.length === 0);
});

test("NameParser: parser with non-ASCII stop chars", (context: TestContext) => {
    const node = parseName("foo名字bar", c => c.currentCharacter === "名");

    context.assert.strictEqual((node.children[0] as LiteralSyntaxNode).value, "foo");
});

test("NameParser: keeps trailing whitespace", (context: TestContext) => {
    const node = parseName("foo   ", c => c.currentCharacter === ">");

    context.assert.strictEqual((node.children[0] as LiteralSyntaxNode).value, "foo   ");
});

test("NameParser: parses nothing if input is stop char", (context: TestContext) => {
    const parserContext = createNameContext(">");
    const node = NameParser.parse(parserContext, TestNameNode, c => c.currentCharacter === ">");

    context.assert.strictEqual(node.children.length, 0);
    context.assert.strictEqual(parserContext.diagnostics.length, 1);
    context.assert.strictEqual(parserContext.diagnostics[0].message.code, DiagnosticMessages.InvalidName.code);
    context.assert.strictEqual(parserContext.diagnostics[0].message.message, DiagnosticMessages.InvalidName.message);
});

test("NameParser: embedded whitespace handled if not stopping", (context: TestContext) => {
    const node = parseName("foo bar", c => false);

    context.assert.strictEqual((node.children[0] as LiteralSyntaxNode).value, "foo bar");
});

test("NameParser: does not trim whitespace by default", (context: TestContext) => {
    const node = parseName("   foo  ", c => c.currentCharacter === ">");

    context.assert.strictEqual((node.children[0] as LiteralSyntaxNode).value, "   foo  ");
});

test("NameParser: parses with transition (@)", (context: TestContext) => {
    const node = parseName("foo@bar", c => c.currentCharacter === ">");

    context.assert.strictEqual(node.children.length, 3);
    context.assert.strictEqual((node.children[0] as LiteralSyntaxNode).value, "foo");
    context.assert.strictEqual((node.children[1] as LiteralSyntaxNode).value, "TS");
});

test("NameParser: transition at start", (context: TestContext) => {
    const node = parseName("@foo", c => c.currentCharacter === ">");

    context.assert.strictEqual(node.children.length, 2);
    context.assert.strictEqual((node.children[0] as LiteralSyntaxNode).value, "TS");
    context.assert.strictEqual((node.children[1] as LiteralSyntaxNode).value, "foo");
});

test("NameParser: multiple transitions", (context: TestContext) => {
    let called = 0;
    const CustomRootParser = {
        parse(context: ParserContext): SyntaxNode {
            called++;
            const start = context.currentPosition;
            context.moveNext();
            return new TransitionSyntaxNode("TS", context.getLocation(start));
        }
    };
    const node = parseName("foo@bar@baz", c => c.currentCharacter === ">", CustomRootParser);

    context.assert.strictEqual(node.children.length, 5);
    context.assert.strictEqual(called, 2);
    context.assert.strictEqual((node.children[0] as LiteralSyntaxNode).value, "foo");
    context.assert.strictEqual((node.children[1] as TransitionSyntaxNode).value, "TS");
    context.assert.strictEqual((node.children[2] as LiteralSyntaxNode).value, "bar");
    context.assert.strictEqual((node.children[3] as TransitionSyntaxNode).value, "TS");
    context.assert.strictEqual((node.children[4] as LiteralSyntaxNode).value, "baz");
});

test("NameParser: triggers InvalidName diagnostic on empty result", (context: TestContext) => {
    const parserContext = createNameContext("");
    NameParser.parse(parserContext, TestNameNode, c => c.currentCharacter === ">");

    context.assert.strictEqual(parserContext.diagnostics.some(d => d.message.code === DiagnosticMessages.UnexpectedEndOfInput.code), true);
});

test("NameParser: parser can be called repeatedly", (context: TestContext) => {
    const parserContext = createNameContext("foo bar baz");

    const node1 = NameParser.parse(parserContext, TestNameNode, c => c.currentCharacter === " ");
    const node2 = NameParser.parse(parserContext, TestNameNode, c => c.currentCharacter === " ");
    context.assert.strictEqual((node1.children[0] as LiteralSyntaxNode).value, "foo");
    context.assert.strictEqual((node2.children[0] as LiteralSyntaxNode).value, "bar");
});

test("NameParser: parses names with embedded unicode whitespace", (context: TestContext) => {
    const node = parseName("foo\u2003bar", c => c.currentCharacter === ">");

    context.assert.strictEqual((node.children[0] as LiteralSyntaxNode).value, "foo\u2003bar");
});

test("NameParser: handles sequence of stops and transitions", (context: TestContext) => {
    const node = parseName("foo@bar=baz", c => c.currentCharacter === "=");

    context.assert.strictEqual(node.children.length, 3);
    context.assert.strictEqual((node.children[0] as LiteralSyntaxNode).value, "foo");
    context.assert.strictEqual((node.children[1] as LiteralSyntaxNode).value, "TS");
    context.assert.strictEqual((node.children[2] as LiteralSyntaxNode).value, "bar");
});