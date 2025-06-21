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
import { TransitionParser } from "../../../src/parsers/common/transition.parser.js";
import { AttributeValueParser } from "../../../src/parsers/generic/attribute-value.parser.js";
import { Source } from "../../../src/sources/source.js";
import { AttributeValueSyntaxNode } from "../../../src/syntax/abstracts/attributes/attribute-value-syntax-node.js";
import { LiteralSyntaxNode } from "../../../src/syntax/common/literal-syntax-node.js";
import { QuoteSyntaxNode } from "../../../src/syntax/common/quote-syntax-node.js";
import { TransitionSyntaxNode } from "../../../src/syntax/common/transition-syntax-node.js";
import { TriviaSyntaxNode } from "../../../src/syntax/common/trivia-syntax-node.js";

class TestAttributeSyntaxNode extends AttributeValueSyntaxNode { }
class TestTransitionNode extends TransitionSyntaxNode {
    constructor() { super("TS", null!); }
}

const originalTransitionParse = TransitionParser.parse;
const originalIsEscapedTransition = TransitionParser.isEscapedTransition;

const testParser = {
    parse: (parserContext: ParserContext) => {
        parserContext.moveNext();
        return new TestTransitionNode();
    }
};

test.afterEach(() => {
    TransitionParser.parse = originalTransitionParse;
    TransitionParser.isEscapedTransition = originalIsEscapedTransition;
});

function parseAttributeValue(input: string) {
    const parserContext = new ParserContext(new Source(input), testParser);
    const node = AttributeValueParser.parse(parserContext, TestAttributeSyntaxNode);
    return { node, parserContext };
}

test("AttributeValueParser: parses quoted value", (context: TestContext) => {
    const { node } = parseAttributeValue('"foo123"');

    context.assert.strictEqual(node.children.length, 3);
    context.assert.strictEqual((node.children[0] as QuoteSyntaxNode).value, '"');
    context.assert.strictEqual((node.children[1] as LiteralSyntaxNode).value, "foo123");
    context.assert.strictEqual((node.children[2] as QuoteSyntaxNode).value, '"');
});

test("AttributeValueParser: parses single-quoted value", (context: TestContext) => {
    const { node } = parseAttributeValue("'bar'");

    context.assert.strictEqual(node.children.length, 3);
    context.assert.strictEqual((node.children[0] as QuoteSyntaxNode).value, "'");
    context.assert.strictEqual((node.children[1] as LiteralSyntaxNode).value, "bar");
    context.assert.strictEqual((node.children[2] as QuoteSyntaxNode).value, "'");
});

test("AttributeValueParser: parses empty quoted value", (context: TestContext) => {
    const { node } = parseAttributeValue('""');

    context.assert.strictEqual(node.children.length, 2);
    context.assert.strictEqual((node.children[0] as QuoteSyntaxNode).value, '"');
    context.assert.strictEqual((node.children[1] as QuoteSyntaxNode).value, '"');
});

test("AttributeValueParser: parses unquoted value", (context: TestContext) => {
    const { node } = parseAttributeValue('foobar');

    context.assert.strictEqual(node.children.length, 1);
    context.assert.strictEqual((node.children[0] as LiteralSyntaxNode).value, "foobar");
});

test("AttributeValueParser: parses value with emoji", (context: TestContext) => {
    const { node } = parseAttributeValue('"foo😃bar"');

    context.assert.strictEqual(node.children.length, 3);
    context.assert.strictEqual((node.children[1] as LiteralSyntaxNode).value, "foo😃bar");
});

test("AttributeValueParser: parses unicode value", (context: TestContext) => {
    const { node } = parseAttributeValue('"名字𐍈"');

    context.assert.strictEqual(node.children.length, 3);
    context.assert.strictEqual((node.children[1] as LiteralSyntaxNode).value, "名字𐍈");
});

test("AttributeValueParser: parses long unquoted value", (context: TestContext) => {
    const big = "x".repeat(10000);
    const { node } = parseAttributeValue(big);

    context.assert.strictEqual(node.children.length, 1);
    context.assert.strictEqual((node.children[0] as LiteralSyntaxNode).value!.length, 10000);
});

test("AttributeValueParser: unterminated quoted value emits diagnostic", (context: TestContext) => {
    const { node, parserContext } = parseAttributeValue('"foo');

    context.assert.strictEqual(node.children.length, 2);
    context.assert.strictEqual(parserContext.diagnostics.length, 1);
    context.assert.strictEqual(parserContext.diagnostics[0].message.code, DiagnosticMessages.UnterminatedAttributeValue.code);
    context.assert.strictEqual(parserContext.diagnostics[0].message.message, DiagnosticMessages.UnterminatedAttributeValue.message);
});

test("AttributeValueParser: only opening quote", (context: TestContext) => {
    const { node, parserContext } = parseAttributeValue('"');

    context.assert.strictEqual(node.children.length, 1);
    context.assert.strictEqual(parserContext.diagnostics[0].message.code, DiagnosticMessages.UnterminatedAttributeValue.code);
    context.assert.strictEqual(parserContext.diagnostics[0].message.message, DiagnosticMessages.UnterminatedAttributeValue.message);
});

test("AttributeValueParser: parses quoted with embedded transition", (context: TestContext) => {
    const { node } = parseAttributeValue('"foo@bar@baz"');

    context.assert.strictEqual(node.children.length, 7);
    context.assert.strictEqual((node.children[0] as QuoteSyntaxNode).value, '"');
    context.assert.strictEqual((node.children[1] as LiteralSyntaxNode).value, "foo");
    context.assert.strictEqual((node.children[2] as TestTransitionNode).value, "TS");
    context.assert.strictEqual((node.children[3] as LiteralSyntaxNode).value, "bar");
    context.assert.strictEqual((node.children[4] as TestTransitionNode).value, "TS");
    context.assert.strictEqual((node.children[5] as LiteralSyntaxNode).value, "baz");
    context.assert.strictEqual((node.children[6] as QuoteSyntaxNode).value, '"');
});

test("AttributeValueParser: parses quoted with escaped transition", (context: TestContext) => {
    const { node } = parseAttributeValue('"foo@@bar"');

    context.assert.strictEqual(node.children.length, 3);
    context.assert.strictEqual((node.children[0] as QuoteSyntaxNode).value, '"');
    context.assert.strictEqual((node.children[1] as LiteralSyntaxNode).value, "foo@bar");
    context.assert.strictEqual((node.children[2] as QuoteSyntaxNode).value, '"');
});

test("AttributeValueParser: stops at EOF and emits diagnostic if not valid", (context: TestContext) => {
    const { node, parserContext } = parseAttributeValue("foo");

    context.assert.strictEqual(node.children.length, 1);
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});

test("AttributeValueParser: parses value with transitions and escapes", (context: TestContext) => {
    let sequence = ['foo', '@', 'bar', '@@', 'baz', '@', 'qux'];
    let input = sequence.join('');
    const { node } = parseAttributeValue(`"${input}"`);

    context.assert.strictEqual(node.children.length, 7);
    context.assert.strictEqual((node.children[0] as QuoteSyntaxNode).value, '"');
    context.assert.strictEqual((node.children[1] as LiteralSyntaxNode).value, "foo");
    context.assert.strictEqual((node.children[2] as TestTransitionNode).value, "TS");
    context.assert.strictEqual((node.children[3] as LiteralSyntaxNode).value, "bar@baz");
    context.assert.strictEqual((node.children[4] as TestTransitionNode).value, "TS");
    context.assert.strictEqual((node.children[5] as LiteralSyntaxNode).value, "qux");
});

test("AttributeValueParser: parses only transition (@)", (context: TestContext) => {
    const { node } = parseAttributeValue("@");

    context.assert.strictEqual(node.children.length, 1);
    context.assert.strictEqual((node.children[0] as LiteralSyntaxNode).value, "TS");
});

test("AttributeValueParser: parses only escaped transition (@@)", (context: TestContext) => {
    const { node } = parseAttributeValue("@@");

    context.assert.strictEqual(node.children.length, 1);
    context.assert.strictEqual((node.children[0] as LiteralSyntaxNode).value, "@");
});

test("AttributeValueParser: multiple transitions unquoted", (context: TestContext) => {
    let callTS = 0;
    const countingParser = {
        parse: (parserContext: ParserContext) => {
            callTS++;
            parserContext.moveNext();
            return new TestTransitionNode();
        }
    };
    const parserContext = new ParserContext(new Source("foo@bar@baz"), countingParser);
    const node = AttributeValueParser.parse(parserContext, TestAttributeSyntaxNode);

    context.assert.strictEqual(node.children.length, 5);
    context.assert.strictEqual(callTS, 2);
    context.assert.strictEqual((node.children[0] as LiteralSyntaxNode).value, "foo");
    context.assert.strictEqual((node.children[1] as LiteralSyntaxNode).value, "TS");
    context.assert.strictEqual((node.children[2] as LiteralSyntaxNode).value, "bar");
    context.assert.strictEqual((node.children[3] as LiteralSyntaxNode).value, "TS");
    context.assert.strictEqual((node.children[4] as LiteralSyntaxNode).value, "baz");
});

test("AttributeValueParser: attaches trailing trivia after closing quote", (context: TestContext) => {
    const parserContext = new ParserContext(new Source('"foo"  '), testParser);
    const node = AttributeValueParser.parse(parserContext, TestAttributeSyntaxNode);

    context.assert.ok(node.trailingTrivia instanceof TriviaSyntaxNode);
    context.assert.strictEqual((node.children[1] as LiteralSyntaxNode).value, "foo");
});

test("AttributeValueParser: parser advances context", (context: TestContext) => {
    const parserContext = new ParserContext(new Source('"foo" bar'), testParser);
    AttributeValueParser.parse(parserContext, TestAttributeSyntaxNode);

    context.assert.strictEqual(parserContext.currentCharacter, "b");
});

test("AttributeValueParser: parser can be called repeatedly", (context: TestContext) => {
    const parserContext = new ParserContext(new Source('"foo" "bar" "baz"'), testParser);
    const node1 = AttributeValueParser.parse(parserContext, TestAttributeSyntaxNode);
    const node2 = AttributeValueParser.parse(parserContext, TestAttributeSyntaxNode);
    const node3 = AttributeValueParser.parse(parserContext, TestAttributeSyntaxNode);

    context.assert.strictEqual((node1.children[1] as LiteralSyntaxNode).value, "foo");
    context.assert.strictEqual((node2.children[1] as LiteralSyntaxNode).value, "bar");
    context.assert.strictEqual((node3.children[1] as LiteralSyntaxNode).value, "baz");
});

test("AttributeValueParser: parses quoted value with unicode whitespace", (context: TestContext) => {
    const { node } = parseAttributeValue('"foo\u2003bar"');

    context.assert.strictEqual(node.children.length, 3);
    context.assert.strictEqual((node.children[1] as LiteralSyntaxNode).value, "foo\u2003bar");
});

test("AttributeValueParser: handles sequence of stops and transitions", (context: TestContext) => {
    const { node } = parseAttributeValue("foo@bar=baz");

    context.assert.strictEqual(node.children.length, 3);
    context.assert.strictEqual((node.children[0] as LiteralSyntaxNode).value, "foo");
    context.assert.strictEqual((node.children[1] as LiteralSyntaxNode).value, "TS");
    context.assert.strictEqual((node.children[2] as LiteralSyntaxNode).value, "bar");
});

test("AttributeValueParser: parses with only whitespace", (context: TestContext) => {
    const { node } = parseAttributeValue("   ");

    context.assert.strictEqual(node.children.length, 0);
});

test("AttributeValueParser: parses empty unquoted value (value=)", (context: TestContext) => {
    const { node, parserContext } = parseAttributeValue('');

    context.assert.strictEqual(node.children.length, 0);
    context.assert.ok(parserContext.diagnostics.length === 1);
});

test("AttributeValueParser: only whitespace triggers diagnostic", (context: TestContext) => {
    const { node, parserContext } = parseAttributeValue('     ');

    context.assert.strictEqual(node.children.length, 0);
    context.assert.strictEqual(parserContext.diagnostics.length, 1);
});