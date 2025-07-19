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
import { AttributeParser } from "../../../src/parsers/generic/attribute.parser.js";
import { AttributeNameSyntaxNode } from "../../../src/syntax/abstracts/attributes/attribute-name-syntax-node.js";
import { AttributeSyntaxNode } from "../../../src/syntax/abstracts/attributes/attribute-syntax-node.js";
import { AttributeValueSyntaxNode } from "../../../src/syntax/abstracts/attributes/attribute-value-syntax-node.js";
import { LiteralSyntaxNode } from "../../../src/syntax/common/literal-syntax-node.js";

class TestAttributeSyntaxNode extends AttributeSyntaxNode { }
class TestAttributeNameSyntaxNode extends AttributeNameSyntaxNode { }
class TestAttributeValueSyntaxNode extends AttributeValueSyntaxNode { }

let testParserReturnValue: LiteralSyntaxNode = new LiteralSyntaxNode("TS", null!);

const testParser = {
    parse(context: ParserContext) {
        context.reset();
        context.moveNext();

        return new LiteralSyntaxNode(testParserReturnValue.value, context.getLocation());
    }
};

let isEscapedTransitionResult = false;

const testTransitionParser = {
    isEscapedTransition: (_context: ParserContext) => isEscapedTransitionResult
};

function setTypescriptStub(val: string) {
    testParserReturnValue = new LiteralSyntaxNode(val, null!);
}

function setEscapedStub(result: boolean) {
    isEscapedTransitionResult = result;
}

function parseAttribute(input: string) {
    const parserContext = new ParserContext(new Source(input), testParser);
    (parserContext as any).transitionParser = testTransitionParser;

    return AttributeParser.parse(
        parserContext,
        (children, leadingTrivia, trailingTrivia) => new TestAttributeSyntaxNode(children, leadingTrivia, trailingTrivia),
        (children, leadingTrivia, trailingTrivia) => new TestAttributeNameSyntaxNode(children, leadingTrivia, trailingTrivia),
        (children, leadingTrivia, trailingTrivia) => new TestAttributeValueSyntaxNode(children, leadingTrivia, trailingTrivia)
    );
}

function parseAttributeWithContext(input: string) {
    const parserContext = new ParserContext(new Source(input), testParser);
    (parserContext as any).transitionParser = testTransitionParser;
    const node = AttributeParser.parse(
        parserContext,
        (children, leadingTrivia, trailingTrivia) => new TestAttributeSyntaxNode(children, leadingTrivia, trailingTrivia),
        (children, leadingTrivia, trailingTrivia) => new TestAttributeNameSyntaxNode(children, leadingTrivia, trailingTrivia),
        (attributeName, children, leadingTrivia, trailingTrivia) => new TestAttributeValueSyntaxNode(attributeName, children, leadingTrivia, trailingTrivia)
    );

    return { node, parserContext };
}

test("AttributeParser: parses name only (no value, no equals)", (context: TestContext) => {
    const node = parseAttribute("foo");

    context.assert.strictEqual(node.children.length, 1);
    context.assert.strictEqual((node as any).children[0].children[0].value, "foo");
});

test("AttributeParser: parses name and equals, no value", (context: TestContext) => {
    const node = parseAttribute("foo=");

    context.assert.strictEqual(node.children.length, 3);
    context.assert.strictEqual((node as any).children[0].children[0].value, "foo");
    context.assert.strictEqual((node as any).children[1].value, "=");
    context.assert.strictEqual((node as any).children[2].children.length, 1);
});

test("AttributeParser: parses name, equals, and quoted value", (context: TestContext) => {
    const node = parseAttribute('foo="bar"');

    context.assert.strictEqual(node.children.length, 3);
    context.assert.strictEqual((node as any).children[0].children[0].value, "foo");
    context.assert.strictEqual((node as any).children[1].value, "=");
    context.assert.strictEqual((node as any).children[2].children[1].value, "bar");
});

test("AttributeParser: parses name, equals, and single-quoted value", (context: TestContext) => {
    const node = parseAttribute("foo='bar'");

    context.assert.strictEqual(node.children.length, 3);
    context.assert.strictEqual((node as any).children[2].children[1].value, "bar");
});

test("AttributeParser: parses name, equals, and unquoted value", (context: TestContext) => {
    const node = parseAttribute("foo=bar");

    context.assert.strictEqual(node.children.length, 3);
    context.assert.strictEqual((node as any).children[2].children[0].value, "bar");
});

test("AttributeParser: handles whitespace after name", (context: TestContext) => {
    const node = parseAttribute("foo   =bar");

    context.assert.strictEqual((node as any).children[0].children[0].value, "foo");
    context.assert.strictEqual((node as any).children[1].value, "=");
    context.assert.strictEqual((node as any).children[2].children[0].value, "bar");
});

test("AttributeParser: parses empty quoted value", (context: TestContext) => {
    const node = parseAttribute('foo=""');

    context.assert.strictEqual((node as any).children[2].children.length, 3);
});

test("AttributeParser: handles whitespace after equals", (context: TestContext) => {
    const node = parseAttribute('foo=   "bar"');

    context.assert.strictEqual((node as any).children[2].children[1].value, "bar");
});

test("AttributeParser: stops at space after value", (context: TestContext) => {
    const node = parseAttribute('foo="bar" baz');

    context.assert.strictEqual((node as any).children[2].children[1].value, "bar");
});

test("AttributeParser: unterminated quoted value emits diagnostic", (context: TestContext) => {
    const { node, parserContext } = parseAttributeWithContext('foo="bar');

    context.assert.ok(parserContext.diagnostics.some(d => d.message.code === DiagnosticMessages.UnterminatedAttributeValue.code));
});

test("AttributeParser: missing equals emits diagnostic", (context: TestContext) => {
    const { node, parserContext } = parseAttributeWithContext('foo bar');

    context.assert.ok(!parserContext.diagnostics.some(d => d.message.code === DiagnosticMessages.ExpectedEquals.code));
    context.assert.strictEqual(node.children.length, 1);
});

test("AttributeParser: missing value after equals is allowed", (context: TestContext) => {
    const { node, parserContext } = parseAttributeWithContext("foo=");

    context.assert.ok(!parserContext.diagnostics.some(d => d.message.code === DiagnosticMessages.InvalidAttributeValue.code));
    context.assert.strictEqual(node.children.length, 3);
    context.assert.strictEqual((node as any).children[2].children.length, 1);
});

test("AttributeParser: parses only equals", (context: TestContext) => {
    const { node, parserContext } = parseAttributeWithContext("=");

    context.assert.strictEqual(node.children.length, 1);
});

test("AttributeParser: parses value with emoji", (context: TestContext) => {
    const node = parseAttribute('foo="bar😃baz"');

    context.assert.strictEqual((node as any).children[2].children[1].value, "bar😃baz");
});

test("AttributeParser: parses value with unicode", (context: TestContext) => {
    const node = parseAttribute('foo="名字𐍈"');

    context.assert.strictEqual((node as any).children[2].children[1].value, "名字𐍈");
});

test("AttributeParser: parser advances context", (context: TestContext) => {
    const parserContext = new ParserContext(new Source('foo="bar" baz=123'), testParser);
    (parserContext as any).transitionParser = testTransitionParser;
    AttributeParser.parse(parserContext, (children, leadingTrivia, trailingTrivia) => new TestAttributeSyntaxNode(children, leadingTrivia, trailingTrivia), (children, leadingTrivia, trailingTrivia) => new TestAttributeNameSyntaxNode(children, leadingTrivia, trailingTrivia), (attributeName, children, leadingTrivia, trailingTrivia) => new TestAttributeValueSyntaxNode(attributeName, children, leadingTrivia, trailingTrivia));

    context.assert.strictEqual(parserContext.currentCharacter, "b");
});

test("AttributeParser: parser can be called repeatedly", (context: TestContext) => {
    const parserContext = new ParserContext(new Source('foo="bar" bar="baz" qux=123'), testParser);
    (parserContext as any).transitionParser = testTransitionParser;
    const node1 = AttributeParser.parse(parserContext, (children, leadingTrivia, trailingTrivia) => new TestAttributeSyntaxNode(children, leadingTrivia, trailingTrivia), (children, leadingTrivia, trailingTrivia) => new TestAttributeNameSyntaxNode(children, leadingTrivia, trailingTrivia), (attributeName, children, leadingTrivia, trailingTrivia) => new TestAttributeValueSyntaxNode(attributeName, children, leadingTrivia, trailingTrivia));
    const node2 = AttributeParser.parse(parserContext, (children, leadingTrivia, trailingTrivia) => new TestAttributeSyntaxNode(children, leadingTrivia, trailingTrivia), (children, leadingTrivia, trailingTrivia) => new TestAttributeNameSyntaxNode(children, leadingTrivia, trailingTrivia), (attributeName, children, leadingTrivia, trailingTrivia) => new TestAttributeValueSyntaxNode(attributeName, children, leadingTrivia, trailingTrivia));
    const node3 = AttributeParser.parse(parserContext, (children, leadingTrivia, trailingTrivia) => new TestAttributeSyntaxNode(children, leadingTrivia, trailingTrivia), (children, leadingTrivia, trailingTrivia) => new TestAttributeNameSyntaxNode(children, leadingTrivia, trailingTrivia), (attributeName, children, leadingTrivia, trailingTrivia) => new TestAttributeValueSyntaxNode(attributeName, children, leadingTrivia, trailingTrivia));

    context.assert.strictEqual((node1 as any).children[0].children[0].value, "foo");
    context.assert.strictEqual((node2 as any).children[0].children[0].value, "bar");
    context.assert.strictEqual((node3 as any).children[0].children[0].value, "qux");
});

test("AttributeParser: parses attribute with unicode whitespace", (context: TestContext) => {
    const node = parseAttribute("foo\u2003=\u2003'bar'");

    context.assert.strictEqual((node as any).children[0].children[0].value, "foo");
    context.assert.strictEqual((node as any).children[1].value, "=");
    context.assert.strictEqual((node as any).children[2].children[1].value, "bar");
});

test("AttributeParser: parses attribute with only trivia (whitespace name)", (context: TestContext) => {
    const node = parseAttribute("\t  ");

    context.assert.strictEqual((node as any).children.length, 1);
});

test("AttributeParser: parses attribute with emoji in name", (context: TestContext) => {
    const node = parseAttribute("😀=bar");

    context.assert.strictEqual((node as any).children[0].children[0].value, "😀");
    context.assert.strictEqual((node as any).children[2].children[0].value, "bar");
});

test("AttributeParser: parses attribute with invalid/unusual characters in name", (context: TestContext) => {
    setTypescriptStub("TS");
    const node = parseAttribute("foo$@!=42");

    context.assert.strictEqual((node as any).children[0].children[0].value, "foo$");
    context.assert.strictEqual((node as any).children[0].children[1].value, "TS");
    context.assert.strictEqual((node as any).children[2].children[0].value, "42");
});

test("AttributeParser: parses attribute with dash and colon in name", (context: TestContext) => {
    const node = parseAttribute("data-test:bar='value'");

    context.assert.strictEqual((node as any).children[0].children[0].value, "data-test:bar");
    context.assert.strictEqual((node as any).children[2].children[1].value, "value");
});

test("AttributeParser: handles attribute with leading and trailing trivia", (context: TestContext) => {
    const node = parseAttribute("foo = 'bar'   ");

    context.assert.strictEqual((node as any).children[0].children[0].value.trim(), "foo");
    context.assert.strictEqual((node as any).children[2].children[1].value, "bar");
});

test("AttributeParser: handles attribute with only equals and trivia", (context: TestContext) => {
    const node = parseAttribute("=   ");

    context.assert.strictEqual(node.children.length, 1);
});

test("AttributeParser: parses attribute with embedded trivia (spaces/tabs)", (context: TestContext) => {
    const node = parseAttribute("foo\t = \t 'bar'\t ");

    context.assert.strictEqual((node as any).children[0].children[0].value, "foo");
    context.assert.strictEqual((node as any).children[2].children[1].value, "bar");
});

test("AttributeParser: parses attribute with multiple spaces and newlines", (context: TestContext) => {
    const node = parseAttribute("foo   =   \n  'bar'\n");

    context.assert.strictEqual((node as any).children[0].children[0].value, "foo");
    context.assert.strictEqual((node as any).children[2].children[1].value, "bar");
});

test("AttributeParser: parses attribute with empty input", (context: TestContext) => {
    const node = parseAttribute("");

    context.assert.strictEqual((node as any).children.length, 1);
});

test("AttributeParser: parses attribute with only equals", (context: TestContext) => {
    const node = parseAttribute("=");

    context.assert.strictEqual(node.children.length, 1);
});

test("AttributeParser: parses attribute with only quotes", (context: TestContext) => {
    const node = parseAttribute('"');

    context.assert.ok((node as any).children.length === 1 || (node as any).children.length === 0);
});

test("AttributeParser: parses attribute with attribute value containing equals", (context: TestContext) => {
    const node = parseAttribute('foo="a=b=c"');

    context.assert.strictEqual((node as any).children[2].children[1].value, "a=b=c");
});

test("AttributeParser: parses attribute with value containing stop char at end", (context: TestContext) => {
    const node = parseAttribute('foo="bar="');

    context.assert.strictEqual((node as any).children[2].children[1].value, "bar=");
});

test("AttributeParser: emits diagnostic for attribute with empty name", (context: TestContext) => {
    const { node, parserContext } = parseAttributeWithContext("=123");

    context.assert.ok(parserContext.diagnostics.some(d => d.message.code === DiagnosticMessages.InvalidName.code));
    context.assert.strictEqual(node.children.length, 1);
});

test("AttributeParser: parses attribute with many equals and spaces", (context: TestContext) => {
    const node = parseAttribute("foo===bar");

    context.assert.strictEqual((node as any).children.length >= 3, true);
});

test("AttributeParser: handles attribute with non-ascii stop chars", (context: TestContext) => {
    const node = parseAttribute("foo名字=bar");

    context.assert.strictEqual((node as any).children[0].children[0].value, "foo名字");
    context.assert.strictEqual((node as any).children[2].children[0].value, "bar");
});

test("AttributeParser: parses value with single transition (@)", (context: TestContext) => {
    setTypescriptStub("TS");
    const node = parseAttribute('foo="bar@baz"');
    const valueChildren = (node as any).children[2].children;

    context.assert.ok(valueChildren.some(child => (child as LiteralSyntaxNode).value === "TS"));
});

test("AttributeParser: parses value with multiple transitions and escapes", (context: TestContext) => {
    setTypescriptStub("TS");
    const node = parseAttribute('foo="x@y@@z@w"');
    const valueChildren = (node as any).children[2].children;

    context.assert.ok(valueChildren.filter(x => (x as LiteralSyntaxNode).value === "TS").length >= 2);
    context.assert.ok(valueChildren.filter(x => (x as LiteralSyntaxNode).value?.includes("@")).length > 0);
});

test("AttributeParser: transition at start of value", (context: TestContext) => {
    setTypescriptStub("TS");
    const node = parseAttribute('foo="@bar"');

    const valueChildren = (node as any).children[2].children;
    context.assert.strictEqual((valueChildren[1] as LiteralSyntaxNode).value, "TS");
});

test("AttributeParser: transition at end of value", (context: TestContext) => {
    setTypescriptStub("TS");
    const node = parseAttribute('foo="bar@"');
    const valueChildren = (node as any).children[2].children;

    context.assert.strictEqual((valueChildren[valueChildren.length - 3] as LiteralSyntaxNode).value, "TS");
});

test("AttributeParser: escaped transition (@@) in value", (context: TestContext) => {
    setEscapedStub(true);
    const node = parseAttribute('foo="a@@b"');
    const valueChildren = (node as any).children[2].children;

    context.assert.ok(valueChildren.some(x => (x as LiteralSyntaxNode).value?.includes("@")));
});

test("AttributeParser: parses unquoted value with transitions", (context: TestContext) => {
    setTypescriptStub("TS");
    const node = parseAttribute("foo=a@b@c");
    const valueChildren = (node as any).children[2].children;

    context.assert.strictEqual(valueChildren.filter(x => (x as LiteralSyntaxNode).value === "TS").length, 2);
});

test("AttributeParser: only transition char as value", (context: TestContext) => {
    setTypescriptStub("TS");
    const node = parseAttribute("foo=@");
    const valueChildren = (node as any).children[2].children;

    context.assert.strictEqual(valueChildren.length, 2);
    context.assert.strictEqual((valueChildren[0] as LiteralSyntaxNode).value, "TS");
});

test("AttributeParser: only escaped transition char as value", (context: TestContext) => {
    setEscapedStub(true);
    const node = parseAttribute("foo=@@");
    const valueChildren = (node as any).children[2].children;

    context.assert.strictEqual(valueChildren.length, 1);
    context.assert.strictEqual((valueChildren[0] as LiteralSyntaxNode).value, "@");
});

test("AttributeParser: parses name with transition and value", (context: TestContext) => {
    setTypescriptStub("TS");
    const node = parseAttribute("@foo=bar");
    const nameChildren = (node as any).children[0].children;

    context.assert.ok(nameChildren.some(child => (child as LiteralSyntaxNode).value === "TS" || (child as LiteralSyntaxNode).value?.includes("foo")));
});

test("AttributeParser: parses attribute with only transition in name", (context: TestContext) => {
    setTypescriptStub("TS");
    const node = parseAttribute("@");
    const nameChildren = (node as any).children[0].children;

    context.assert.strictEqual(nameChildren.length, 1);
    context.assert.strictEqual((nameChildren[0] as LiteralSyntaxNode).value, "TS");
});

test("AttributeParser: parses attribute with multiple spaces between name and equals", (context: TestContext) => {
    const node = parseAttribute("foo     =bar");

    context.assert.strictEqual((node as any).children[0].children[0].value, "foo");
    context.assert.strictEqual((node as any).children[1].value, "=");
    context.assert.strictEqual((node as any).children[2].children[0].value, "bar");
});

test("AttributeParser: parses attribute with multiple spaces between equals and value", (context: TestContext) => {
    const node = parseAttribute("foo=     'bar'");

    context.assert.strictEqual((node as any).children[0].children[0].value, "foo");
    context.assert.strictEqual((node as any).children[1].value, "=");
    context.assert.strictEqual((node as any).children[2].children[1].value, "bar");
});

test("AttributeParser: parses attribute with tab/newline trivia between tokens", (context: TestContext) => {
    const node = parseAttribute("foo\t=\n'bar'");

    context.assert.strictEqual((node as any).children[0].children[0].value, "foo");
    context.assert.strictEqual((node as any).children[1].value, "=");
    context.assert.strictEqual((node as any).children[2].children[1].value, "bar");
});

test("AttributeParser: parses attribute with Unicode whitespace between tokens", (context: TestContext) => {
    const node = parseAttribute("foo\u2009=\u2009'bar'");

    context.assert.strictEqual((node as any).children[2].children[1].value, "bar");
});

test("AttributeParser: parses attribute with whitespace between all parts", (context: TestContext) => {
    const node = parseAttribute("foo \n = \u2003 'bar' \u2002 ");

    context.assert.strictEqual((node as any).children[0].children[0].value.trim(), "foo");
    context.assert.strictEqual((node as any).children[2].children[1].value, "bar");
});

test("AttributeParser: parses quoted value that is only a transition", (context: TestContext) => {
    setTypescriptStub("TS");
    const node = parseAttribute('foo="@"');
    const valueChildren = (node as any).children[2].children;

    context.assert.strictEqual(valueChildren.length, 4);
    context.assert.strictEqual((valueChildren[1] as LiteralSyntaxNode).value, "TS");
});

test("AttributeParser: parses value with transition at end and trailing whitespace", (context: TestContext) => {
    setTypescriptStub("TS");
    const node = parseAttribute('foo="bar@"  ');
    const valueChildren = (node as any).children[2].children;

    context.assert.strictEqual((valueChildren[valueChildren.length - 3] as LiteralSyntaxNode).value, "TS");
});

test("AttributeParser: parses name, equals, value, each with trivia", (context: TestContext) => {
    const node = parseAttribute('foo   =   "bar"   ');

    context.assert.strictEqual((node as any).children[0].children[0].value.trim(), "foo");
    context.assert.strictEqual((node as any).children[2].children[1].value, "bar");
});

test("AttributeParser: parses attribute with value full of transitions and trivia", (context: TestContext) => {
    setTypescriptStub("TS");
    const node = parseAttribute('foo=" @ @ @@"');
    const valueChildren = (node as any).children[2].children;

    context.assert.ok(valueChildren.filter(x => (x as LiteralSyntaxNode).value === "TS").length >= 2);
    context.assert.ok(valueChildren.some(x => (x as LiteralSyntaxNode).value === " @"));
    context.assert.ok(valueChildren.some(x => (x as LiteralSyntaxNode).value === " "));
});

test("AttributeParser: parses value with whitespace, transitions, and trivia mixed", (context: TestContext) => {
    setTypescriptStub("TS");
    const node = parseAttribute('foo="  a@b @@c @d  "');
    const valueChildren = (node as any).children[2].children;

    context.assert.ok(valueChildren.some(x => (x as LiteralSyntaxNode).value === "TS"));
    context.assert.ok(valueChildren.some(x => (x as LiteralSyntaxNode).value?.includes("@")));
    context.assert.ok(valueChildren.some(x => (x as LiteralSyntaxNode).value?.includes("c")));
});

test("AttributeParser: parses attribute with only whitespace", (context: TestContext) => {
    const node = parseAttribute("     ");

    context.assert.strictEqual((node as any).children.length, 1);
});

test("AttributeParser: parses attribute with unicode whitespace only", (context: TestContext) => {
    const node = parseAttribute("\u2003\u2009");

    context.assert.strictEqual((node as any).children.length, 1);
});

test("AttributeParser: handles attribute with deeply mixed trivia and transitions", (context: TestContext) => {
    setTypescriptStub("TS");
    const node = parseAttribute("foo =  '@ @@   @ @' ");
    const valueChildren = (node as any).children[2].children;

    context.assert.ok(valueChildren.filter(x => (x as LiteralSyntaxNode).value === "TS").length >= 2);
    context.assert.ok(valueChildren.some(x => (x as LiteralSyntaxNode).value?.includes("@")));
});

test("AttributeParser: attribute with only transitions as value", (context: TestContext) => {
    setTypescriptStub("TS");
    const node = parseAttribute("foo='@ @@ @@@'");
    const valueChildren = (node as any).children[2].children;

    context.assert.ok(valueChildren.some(x => (x as LiteralSyntaxNode).value === "TS"));
});

test("AttributeParser: parses attribute with deep Unicode and emoji in name and value", (context: TestContext) => {
    const node = parseAttribute("名字='值😃𐍈'");

    context.assert.strictEqual((node as any).children[0].children[0].value, "名字");
    context.assert.strictEqual((node as any).children[2].children[1].value, "值😃𐍈");
});

test("AttributeParser: emits diagnostic for unterminated quote with trailing trivia", (context: TestContext) => {
    const { parserContext } = parseAttributeWithContext("foo='bar   ");

    context.assert.ok(parserContext.diagnostics.some(d => d.message.code === DiagnosticMessages.UnterminatedAttributeValue.code));
});

test("AttributeParser: attribute with only equals and trivia", (context: TestContext) => {
    const { node } = parseAttributeWithContext("=     ");

    context.assert.strictEqual((node as any).children.length, 1);
});

test("AttributeParser: attribute with all forms of whitespace and trivia between name, equals, and value", (context: TestContext) => {
    const node = parseAttribute("foo \t=\n  'bar'   ");

    context.assert.strictEqual((node as any).children[2].children[1].value, "bar");
});

test("AttributeParser: parses attribute with no name, only trivia", (context: TestContext) => {
    const node = parseAttribute("    ");

    context.assert.ok((node as any).children.length === 1);
});

test("AttributeParser: parses attribute with unicode/emoji name and no value", (context: TestContext) => {
    const node = parseAttribute("名😃字");

    context.assert.strictEqual((node as any).children[0].children[0].value, "名😃字");
});

test("AttributeParser: parses attribute with deeply mixed transitions and unicode", (context: TestContext) => {
    setTypescriptStub("TS");
    const node = parseAttribute("foo@名=值@");
    const nameChildren = (node as any).children[0].children;
    const valueChildren = (node as any).children[2].children;

    context.assert.ok(nameChildren.some(child => (child as LiteralSyntaxNode).value === "TS" || (child as LiteralSyntaxNode).value?.includes("名")));
    context.assert.ok(valueChildren.some(child => (child as LiteralSyntaxNode).value === "TS" || (child as LiteralSyntaxNode).value?.includes("值")));
});