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
import { TagSyntaxNode } from "../../../../src/syntax/abstracts/tags/tag-syntax-node.js";
import { BraceSyntaxNode } from "../../../../src/syntax/common/brace-syntax-node.js";
import { TransitionSyntaxNode } from "../../../../src/syntax/common/transition-syntax-node.js";
import { TestParser } from "../../../_fixtures/parsers-fixtures.js";

class TestCodeSyntaxNode extends CodeSyntaxNode { }
class TestCodeValueSyntaxNode extends CodeValueSyntaxNode { }

function parseCode(input: string) {
    const parserContext = new ParserContext(new Source(input), TestParser);
    const node = CodeParser.parse(parserContext, TestCodeSyntaxNode, TestCodeValueSyntaxNode);

    return { node, parserContext };
}

test("CodeParser: parses block code with content", (context: TestContext) => {
    const { node } = parseCode("@{ let x = 1; }");

    context.assert.ok(node instanceof CodeSyntaxNode);
    context.assert.ok(node.children[0] instanceof TransitionSyntaxNode);
    context.assert.ok(node.children[1] instanceof BraceSyntaxNode);
    context.assert.strictEqual((node.children.at(-1) as any).value, "}");
});

test("CodeParser: parses block code with emoji", (context: TestContext) => {
    const { node } = parseCode("@{ let smile = '😀'; }");
    const codeStr = node.children.map(c => (c as any).value || "").join("");

    context.assert.ok(codeStr.includes("😀"));
});

test("CodeParser: parses block code with nested braces", (context: TestContext) => {
    const { node } = parseCode("@{ if (x) { let y = 2; } }");

    context.assert.ok(node.children.some(c => (c as any).value === "{"));
    context.assert.strictEqual((node.children.at(-1) as any).value, "}");
});

test("CodeParser: block code with nested code block", (context: TestContext) => {
    const { node } = parseCode("@{ var x = @{ let y = 2; }; }");
    const openCount = node.children.filter(c => (c as any).value === "{").length;
    const closeCount = node.children.filter(c => (c as any).value === "}").length;

    context.assert.ok(openCount === 1 && closeCount === 1);
});

test("CodeParser: parses block code with tag", (context: TestContext) => {
    const { node } = parseCode("@{ let x = 1; <div>hello</div>; }");

    context.assert.ok(node.children.some(c => c instanceof TagSyntaxNode));
});

test("CodeParser: parses block code with multiple tags", (context: TestContext) => {
    const { node } = parseCode("@{ <span>one</span> <b>two</b> }");

    const tagCount = node.children.filter(c => c instanceof TagSyntaxNode).length;
    context.assert.ok(tagCount >= 2);
});

test("CodeParser: parses block code with Unicode tag", (context: TestContext) => {
    const { node } = parseCode("@{ <名字>内容</名字> }");

    context.assert.ok(node.children.some(c => c instanceof TagSyntaxNode));
});

test("CodeParser: parses block code with emoji in tag", (context: TestContext) => {
    const { node } = parseCode("@{ <😀>smile</😀> }");

    context.assert.ok(node.children.some(c => c instanceof TagSyntaxNode));
});

test("CodeParser: handles EOF inside block", (context: TestContext) => {
    const { parserContext } = parseCode("@{ let x = 1;");

    context.assert.ok(parserContext.diagnostics.some(d => d.message.code === DiagnosticMessages.UnexpectedEndOfInput.code));
});

test("CodeParser: handles block code with only a tag", (context: TestContext) => {
    const { node } = parseCode("@{ <div>bar</div> }");

    context.assert.ok(node.children.some(c => c instanceof TagSyntaxNode));
});

test("CodeParser: handles nested tags in code block", (context: TestContext) => {
    const { node } = parseCode("@{ <ul><li>Item</li></ul> }");
    const ulTag = node.children[3] as any;
    const liTag = ulTag.children[1];
    const liChildren = liTag.children;
    const itemTextNode = liChildren.find((n: any) => n.value === "Item");

    context.assert.ok(ulTag instanceof TagSyntaxNode, "First tag should be <ul>");
    context.assert.ok(liTag instanceof TagSyntaxNode, "Second tag should be <li>");
    context.assert.ok(itemTextNode, "Should have text node 'Item' inside <li>");
});

test("CodeParser: parses code block with deeply nested braces", (context: TestContext) => {
    const { node } = parseCode("@{ if (x) { while(y) { <span>hi</span> } } }");
    const tagNodes = node.children.filter(c => c instanceof TagSyntaxNode);
    
    context.assert.ok(tagNodes.length > 0);
});

test("CodeParser: parses block with only whitespace", (context: TestContext) => {
    const { node } = parseCode("@{   }");
    const values = node.children
        .filter(c => c instanceof CodeValueSyntaxNode)
        .map((c: any) => c.value.trim());

    context.assert.ok(values.every(v => v === ""));
});