/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { ParserContext } from "../../../../src/context/parser-context.js";
import { DiagnosticMessages } from "../../../../src/diagnostics/diagnostic-messages.js";
import { CodeParser } from "../../../../src/parsers/generic/code/code.parser.js";
import { Source } from "../../../../src/sources/source.js";
import { CodeSyntaxNode } from "../../../../src/syntax/abstracts/code/code-syntax-node.js";
import { CodeValueSyntaxNode } from "../../../../src/syntax/abstracts/code/code-value-syntax-node.js";
import { TransitionSyntaxNode } from "../../../../src/syntax/common/transition-syntax-node.js";
import { TestParser } from "../../../_fixtures/parsers-fixtures.js";

class TestCodeSyntaxNode extends CodeSyntaxNode { }
class TestCodeValueSyntaxNode extends CodeValueSyntaxNode { }

function parseCode(input: string) {
    const parserContext = new ParserContext(new Source(input), TestParser);
    const node = CodeParser.parse(parserContext, TestCodeSyntaxNode, TestCodeValueSyntaxNode);
    return { node, parserContext };
}

test("CodeParser: parses simple inline code after transition", (context: TestContext) => {
    const { node } = parseCode("@foo");

    context.assert.ok(node instanceof CodeSyntaxNode);
    context.assert.ok(node.children[0] instanceof TransitionSyntaxNode);
    context.assert.strictEqual((node.children[1] as CodeValueSyntaxNode).value, "foo");
});

test("CodeParser: parses empty inline code after transition", (context: TestContext) => {
    const { node } = parseCode("@");

    context.assert.ok(node instanceof CodeSyntaxNode);
    context.assert.strictEqual(node.children.length, 1);
    context.assert.ok(node.children[0] instanceof TransitionSyntaxNode);
});

test("CodeParser: parses inline code with emoji", (context: TestContext) => {
    const { node } = parseCode("@😀foo");

    context.assert.ok(node.children[1] instanceof CodeValueSyntaxNode);
    context.assert.strictEqual((node.children[1] as CodeValueSyntaxNode).value, "😀foo");
});

test("CodeParser: parses inline code with Unicode", (context: TestContext) => {
    const { node } = parseCode("@名字𐍈");

    context.assert.strictEqual((node.children[1] as CodeValueSyntaxNode).value, "名字𐍈");
});

test("CodeParser: stops inline code at whitespace or operator", (context: TestContext) => {
    const { node } = parseCode("@foo bar=baz");

    context.assert.strictEqual((node.children[1] as CodeValueSyntaxNode).value, "foo");
});

test("CodeParser: stops inline code at tag", (context: TestContext) => {
    const { node } = parseCode("@foo <div>bar</div>");

    context.assert.strictEqual((node.children[1] as CodeValueSyntaxNode).value, "foo");
});

test("CodeParser: handles EOF in inline", (context: TestContext) => {
    const { node, parserContext } = parseCode("@foo");
    context.assert.strictEqual((node.children[1] as CodeValueSyntaxNode).value, "foo");

    context.assert.ok(!parserContext.diagnostics.some(d => d.message.code === DiagnosticMessages.UnexpectedEndOfInput.code));
});

test("CodeParser: parses inline code containing a tag start char", (context: TestContext) => {
    const { node } = parseCode("@foo<bar");
    context.assert.strictEqual((node.children[1] as CodeValueSyntaxNode).value, "foo");
});