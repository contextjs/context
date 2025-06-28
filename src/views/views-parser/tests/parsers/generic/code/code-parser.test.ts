/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { DiagnosticMessages, Source } from "@contextjs/views";
import test, { TestContext } from "node:test";
import { ParserContext } from "../../../../src/context/parser-context.js";
import { CodeParser } from "../../../../src/parsers/generic/code/code.parser.js";
import { BraceSyntaxNode } from "../../../../src/syntax/abstracts/brace-syntax-node.js";
import { CodeBlockSyntaxNode } from "../../../../src/syntax/abstracts/code/code-block-syntax-node.js";
import { CodeExpressionSyntaxNode } from "../../../../src/syntax/abstracts/code/code-expression-syntax-node.js";
import { CodeValueSyntaxNode } from "../../../../src/syntax/abstracts/code/code-value-syntax-node.js";
import { TagSyntaxNode } from "../../../../src/syntax/abstracts/tags/tag-syntax-node.js";
import { TransitionSyntaxNode } from "../../../../src/syntax/common/transition-syntax-node.js";
import { TestBraceSyntaxNode, TestCodeBlockSyntaxNode, TestCodeExpressionSyntaxNode, TestCodeValueSyntaxNode, TestParser } from "../../../_fixtures/parsers-fixtures.js";

function parseCode(input: string) {
    const parserContext = new ParserContext(new Source(input), TestParser);
    const node = CodeParser.parse(parserContext, TestCodeBlockSyntaxNode, TestCodeExpressionSyntaxNode, TestCodeValueSyntaxNode, TestBraceSyntaxNode);
    return { node, parserContext };
}

test("CodeParser: parses simple inline code after transition", (context: TestContext) => {
    const { node } = parseCode("@foo");

    context.assert.ok(node instanceof CodeExpressionSyntaxNode);
    context.assert.ok(node.transition instanceof TransitionSyntaxNode);
    context.assert.strictEqual((node.value as CodeValueSyntaxNode).value, "foo");
});

test("CodeParser: parses empty inline code after transition", (context: TestContext) => {
    const { node } = parseCode("@");

    context.assert.ok(node instanceof CodeExpressionSyntaxNode);
    context.assert.strictEqual(node.value.value, "");
    context.assert.ok(node.transition instanceof TransitionSyntaxNode);
});

test("CodeParser: parses inline code with emoji", (context: TestContext) => {
    const { node } = parseCode("@😀foo");

    context.assert.ok(node instanceof CodeExpressionSyntaxNode);
    context.assert.strictEqual(node.value.value, "😀foo");
});

test("CodeParser: parses inline code with Unicode", (context: TestContext) => {
    const { node } = parseCode("@名字𐍈") as any;

    context.assert.strictEqual(node.value.value, "名字𐍈");
});

test("CodeParser: stops inline code at whitespace or operator", (context: TestContext) => {
    const { node } = parseCode("@foo bar=baz") as any;

    context.assert.strictEqual((node.value as CodeValueSyntaxNode).value, "foo");
});

test("CodeParser: parses block code with content", (context: TestContext) => {
    const { node } = parseCode("@{ let x = 1; }");

    context.assert.ok(node instanceof CodeBlockSyntaxNode);
    context.assert.ok(node.transition instanceof TransitionSyntaxNode);
    context.assert.ok(node.openingBrace instanceof BraceSyntaxNode);
    context.assert.strictEqual(node.closingBrace.value, "}");
});

test("CodeParser: parses block code with emoji", (context: TestContext) => {
    const { node } = parseCode("@{ let smile = '😀'; }") as any;
    const codeStr = node.children.map(c => (c as any).value || "").join("");

    context.assert.ok(codeStr.includes("😀"));
});

test("BlockCodeParser: parses block code with nested braces", (context: TestContext) => {
    const { node } = parseCode("@{ if (x) { let y = 2; } }") as any;

    context.assert.strictEqual(node.children[0].value, "if (x) { let y = 2; } ");
    context.assert.ok(node.openingBrace.value === "{");
    context.assert.ok(node.closingBrace.value === "}");
});

test("BlockCodeParser: block code with nested code block", (context: TestContext) => {
    const { node } = parseCode("@{ var x = @{ let y = 2; }; }") as any;

    context.assert.strictEqual(node.children[0].value, "var x = @{ let y = 2; }; ");
    context.assert.ok(node.openingBrace.value === "{");
    context.assert.ok(node.closingBrace.value === "}");
});

test("CodeParser: parses block code with tag", (context: TestContext) => {
    const { node } = parseCode("@{ let x = 1; <div>hello</div>; }") as any;

    context.assert.ok(node.children.some(c => c instanceof TagSyntaxNode));
});

test("CodeParser: parses block code with multiple tags", (context: TestContext) => {
    const { node } = parseCode("@{ <span>one</span> <b>two</b> }") as any;

    const tagCount = node.children.filter(c => c instanceof TagSyntaxNode).length;
    context.assert.ok(tagCount >= 2);
});

test("CodeParser: parses block code with Unicode tag", (context: TestContext) => {
    const { node } = parseCode("@{ <名字>内容</名字> }") as any;

    context.assert.ok(node.children.some(c => c instanceof TagSyntaxNode));
});

test("CodeParser: parses block code with emoji in tag", (context: TestContext) => {
    const { node } = parseCode("@{ <😀>smile</😀> }") as any;

    context.assert.ok(node.children.some(c => c instanceof TagSyntaxNode));
});

test("CodeParser: stops inline code at tag", (context: TestContext) => {
    const { node } = parseCode("@foo <div>bar</div>") as any;

    context.assert.strictEqual((node.value as CodeValueSyntaxNode).value, "foo");
});

test("CodeParser: handles EOF inside block", (context: TestContext) => {
    const { parserContext } = parseCode("@{ let x = 1;");

    context.assert.ok(parserContext.diagnostics.some(d => d.message.code === DiagnosticMessages.UnexpectedEndOfInput.code));
});

test("CodeParser: handles EOF in inline", (context: TestContext) => {
    const { node, parserContext } = parseCode("@foo") as any;

    context.assert.strictEqual((node.value as CodeValueSyntaxNode).value, "foo");
    context.assert.ok(!parserContext.diagnostics.some(d => d.message.code === DiagnosticMessages.UnexpectedEndOfInput.code));
});

test("CodeParser: handles multiple transitions", (context: TestContext) => {
    const { node } = parseCode("@foo@@bar") as any;

    context.assert.strictEqual((node.value as CodeValueSyntaxNode).value, "foo@bar");
});

test("CodeParser: stops at '<' and leaves context for tag parsing", (context: TestContext) => {
    const { node, parserContext } = parseCode("@<div>abc</div>") as any;
    context.assert.ok(node.transition instanceof TransitionSyntaxNode);
    context.assert.strictEqual(parserContext.currentCharacter, "<");
});


test("CodeParser: handles block code with only a tag", (context: TestContext) => {
    const { node } = parseCode("@{ <div>bar</div> }") as any;

    context.assert.ok(node.children.some(c => c instanceof TagSyntaxNode));
});

test("CodeParser: handles nested tags in code block", (context: TestContext) => {
    const { node } = parseCode("@{ <ul><li>Item</li></ul> }") as any;
    const ulTag = node.children[1] as any;
    const liTag = ulTag.children[1];
    const liChildren = liTag.children;
    const itemTextNode = liChildren.find((n: any) => n.value === "Item");

    context.assert.ok(ulTag instanceof TagSyntaxNode, "First tag should be <ul>");
    context.assert.ok(liTag instanceof TagSyntaxNode, "Second tag should be <li>");
    context.assert.ok(itemTextNode, "Should have text node 'Item' inside <li>");
});

test("CodeParser: emits diagnostic if no transition at start", (context: TestContext) => {
    const { parserContext } = parseCode("foo");

    context.assert.ok(parserContext.diagnostics.some(d => d.message.code === DiagnosticMessages.ExpectedTransitionMarker("f").code));
});

test("CodeParser: parses code block with deeply nested braces", (context: TestContext) => {
    const { node } = parseCode("@{ if (x) { while(y) { <span>hi</span> } } }") as any;
    const tagNodes = node.children.filter(c => c instanceof TagSyntaxNode);

    context.assert.ok(tagNodes.length > 0);
});

test("CodeParser: parses block with only whitespace", (context: TestContext) => {
    const { node } = parseCode("@{   }") as any;
    const values = node.children
        .filter(c => c instanceof CodeValueSyntaxNode)
        .map((c: any) => c.value.trim());

    context.assert.ok(values.every(v => v === ""));
});

test("CodeParser: parses inline code containing a tag start char", (context: TestContext) => {
    const { node } = parseCode("@foo<bar") as any;
    context.assert.strictEqual((node.value as CodeValueSyntaxNode).value, "foo");
});