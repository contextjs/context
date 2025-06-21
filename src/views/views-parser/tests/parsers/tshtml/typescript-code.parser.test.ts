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
import { TSHTMLParser } from "../../../src/parsers/tshtml/tshtml.parser.js";
import { TypescriptCodeParser } from "../../../src/parsers/tshtml/typescript-code.parser.js";
import { Source } from "../../../src/sources/source.js";
import { TagSyntaxNode } from "../../../src/syntax/abstracts/tags/tag-syntax-node.js";
import { BraceSyntaxNode } from "../../../src/syntax/common/brace-syntax-node.js";
import { TransitionSyntaxNode } from "../../../src/syntax/common/transition-syntax-node.js";
import { TypescriptCodeSyntaxNode } from "../../../src/syntax/tshtml/typescript-code-syntax-node.js";
import { TypescriptCodeValueSyntaxNode } from "../../../src/syntax/tshtml/typescript-code-value-syntax-node.js";

function parseTypescriptCode(input: string) {
    const context = new ParserContext(new Source(input), TSHTMLParser);
    const node = TypescriptCodeParser.parse(context);
    return { node, context };
}

test("TypescriptCodeParser: parses inline code", (context: TestContext) => {
    const { node } = parseTypescriptCode("@x");

    context.assert.ok(node instanceof TypescriptCodeSyntaxNode);
    context.assert.ok(node.children[0] instanceof TransitionSyntaxNode);
    context.assert.ok(node.children[1] instanceof TypescriptCodeValueSyntaxNode);
    context.assert.strictEqual(node.children[1].value, "x");
});

test("TypescriptCodeParser: parses block code", (context: TestContext) => {
    const { node } = parseTypescriptCode("@{ let x = 1; }");

    context.assert.ok(node instanceof TypescriptCodeSyntaxNode);
    context.assert.ok(node.children[1] instanceof BraceSyntaxNode);
    context.assert.strictEqual((node.children.at(-1) as any).value, "}");
});

test("TypescriptCodeParser: parses block code with nested tag", (context: TestContext) => {
    const { node } = parseTypescriptCode("@{ <div>hi</div> }");
    const hasTag = node.children.some(c => c instanceof TagSyntaxNode);
    
    context.assert.ok(hasTag);
});

test("TypescriptCodeParser: handles EOF inside block", (context: TestContext) => {
    const { context: ctx } = parseTypescriptCode("@{ let x = 1;");

    context.assert.ok(ctx.diagnostics.some(d => d.message.code === DiagnosticMessages.UnexpectedEndOfInput.code));
});

test("TypescriptCodeParser: handles no code after transition", (context: TestContext) => {
    const { node } = parseTypescriptCode("@");

    context.assert.strictEqual(node.children.length, 1);
    context.assert.ok(node.children[0] instanceof TransitionSyntaxNode);
});

test("TypescriptCodeParser: parses inline code with Unicode and emoji", (context: TestContext) => {
    const { node } = parseTypescriptCode("@名字😀") as any;

    context.assert.strictEqual(node.children[1].value, "名字😀");
});
