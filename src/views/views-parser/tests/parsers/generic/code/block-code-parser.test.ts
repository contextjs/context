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
import { CodeValueSyntaxNode } from "../../../../src/syntax/abstracts/code/code-value-syntax-node.js";
import { TagSyntaxNode } from "../../../../src/syntax/abstracts/tags/tag-syntax-node.js";
import { TransitionSyntaxNode } from "../../../../src/syntax/common/transition-syntax-node.js";
import { TestBraceSyntaxNode, TestCodeBlockSyntaxNode, TestCodeExpressionSyntaxNode, TestCodeValueSyntaxNode, TestParser } from "../../../_fixtures/parsers-fixtures.js";

function parseCode(input: string) {
    const parserContext = new ParserContext(new Source(input), TestParser);
    const node = CodeParser.parse(
        parserContext,
        (transition, openingBrace, closingBrace, children, leadingTrivia, trailingTrivia) => new TestCodeBlockSyntaxNode(transition, openingBrace, closingBrace, children, leadingTrivia, trailingTrivia),
        (children, leadingTrivia, trailingTrivia) => new TestCodeExpressionSyntaxNode(children, leadingTrivia, trailingTrivia),
        (children, leadingTrivia, trailingTrivia) => new TestCodeValueSyntaxNode(children, leadingTrivia, trailingTrivia),
        (children, leadingTrivia, trailingTrivia) => new TestBraceSyntaxNode(children, leadingTrivia, trailingTrivia)
    );
    return { node, parserContext };
}

test("BlockCodeParser: parses block code with content", (context: TestContext) => {
    const { node } = parseCode("@{ let x = 1; }");

    context.assert.ok(node instanceof CodeBlockSyntaxNode);
    context.assert.ok(node.transition instanceof TransitionSyntaxNode);
    context.assert.ok(node.openingBrace instanceof BraceSyntaxNode);
    context.assert.ok(node.closingBrace instanceof BraceSyntaxNode);
    context.assert.ok(node.children.some(child => child instanceof CodeValueSyntaxNode));
});

test("BlockCodeParser: parses block code with emoji", (context: TestContext) => {
    const { node } = parseCode("@{ let smile = '😀'; }") as any;

    context.assert.ok(node.children[0] instanceof CodeValueSyntaxNode);
    context.assert.ok((node.children[0] as any).value.includes("😀"));
});

test("BlockCodeParser: parses block code with nested braces", (context: TestContext) => {
    const { node } = parseCode("@{ if (x) { let y = 2; } }") as any;

    context.assert.ok(node.children.length === 1);
    context.assert.ok(node.children[0] instanceof CodeValueSyntaxNode);
    context.assert.strictEqual((node.children[0] as any).value, "if (x) { let y = 2; } ");
});


test("BlockCodeParser: block code with nested code block", (context: TestContext) => {
    const { node } = parseCode("@{ var x = { let y = 2; }; }") as any;

    context.assert.ok(node.children[0] instanceof CodeValueSyntaxNode);
});

test("BlockCodeParser: parses block code with tag", (context: TestContext) => {
    const { node } = parseCode("@{ let x = 1; <div>hello</div>; }") as any;

    context.assert.ok(node.children.some(child => child instanceof TagSyntaxNode));
});

test("BlockCodeParser: parses block code with multiple tags", (context: TestContext) => {
    const { node } = parseCode("@{ <span>one</span> <b>two</b> }") as any;
    const tagCount = node.children.filter(c => c instanceof TagSyntaxNode).length;

    context.assert.ok(tagCount >= 2);
});

test("BlockCodeParser: parses block code with Unicode tag", (context: TestContext) => {
    const { node } = parseCode("@{ <名字>内容</名字> }") as any;

    context.assert.ok(node.children.some(c => c instanceof TagSyntaxNode));
});

test("BlockCodeParser: parses block code with emoji in tag", (context: TestContext) => {
    const { node } = parseCode("@{ <😀>smile</😀> }") as any;

    context.assert.ok(node.children.some(c => c instanceof TagSyntaxNode));
});

test("BlockCodeParser: handles EOF inside block", (context: TestContext) => {
    const { parserContext } = parseCode("@{ let x = 1;");

    context.assert.ok(parserContext.diagnostics.some(d => d.message.code === DiagnosticMessages.UnexpectedEndOfInput.code));
});

test("BlockCodeParser: handles block code with only a tag", (context: TestContext) => {
    const { node } = parseCode("@{ <div>bar</div> }") as any;

    context.assert.ok(node.children.some(c => c instanceof TagSyntaxNode));
});

test("BlockCodeParser: handles nested tags in code block", (context: TestContext) => {
    const { node } = parseCode("@{ <ul><li>Item</li></ul> }") as any;

    const ulTag = node.children.find(c => c instanceof TagSyntaxNode) as TagSyntaxNode;
    context.assert.ok(ulTag, "Should have <ul> tag node");

    const liTag = ulTag.children.find(c => c instanceof TagSyntaxNode) as TagSyntaxNode;
    context.assert.ok(liTag, "Should have <li> tag node inside <ul>");

    const itemTextNode = liTag.children.find(n => (n as any).value === "Item");
    context.assert.ok(itemTextNode, "Should have text node 'Item' inside <li>");
});

test("BlockCodeParser: parses block with only whitespace", (context: TestContext) => {
    const { node } = parseCode("@{   }") as any;
    const values = node.children.filter(c => c instanceof CodeValueSyntaxNode).map((c: any) => c.value.trim());

    context.assert.ok(values.every(v => v === ""));
});

test("BlockCodeParser: parses block containing a loop and nested tags", (context: TestContext) => {
    const { node } = parseCode(`@{ for (let i = 0; i < 3; i++) { <div>Item @i</div> } }`) as any;

    context.assert.match(node.children[0].value, /for \(let i = 0; i < 3; i\+\+\)/);
    context.assert.strictEqual(node.children.filter(c => c instanceof TagSyntaxNode).length, 1);
});

test("BlockCodeParser: parses nested tags with embedded inline TypeScript", (context: TestContext) => {
    const { node, parserContext } = parseCode(`@{ <ul>@{ for (const item of items) { <li>@item.name</li> } }</ul> }`) as any;

    const ulTag = node.children.find(c => c instanceof TagSyntaxNode) as any;
    context.assert.strictEqual(ulTag.children[0].children[1].children[0].value, "ul");

    context.assert.match(ulTag.children[1].children[0].value, /for \(const item of items\)/);
});

test("BlockCodeParser: parses deeply nested TypeScript and tags", (context: TestContext) => {
    const { node } = parseCode(`@{ if (user) { <div>@user.name @{ if(user.details){ <span>@user.details.email</span> } }</div> } }`) as any;

    context.assert.match(node.children[0].value, /if \(user\)/);

    const divTag = node.children.find(c => c instanceof TagSyntaxNode) as any;
    context.assert.strictEqual(divTag.children[0].children[1].children[0].value, "div");

    const nestedCodeBlock = divTag.children.find(c => c instanceof CodeBlockSyntaxNode) as any;
    context.assert.match(nestedCodeBlock.children[0].value, /if\(user\.details\)/);

    const spanTag = nestedCodeBlock.children.find(c => c instanceof TagSyntaxNode) as any;
    context.assert.strictEqual(spanTag.children[0].children[1].children[0].value, "span");
});

test("BlockCodeParser: parses multiple sibling tags inside a loop", (context: TestContext) => {
    const { node } = parseCode(`@{ for(const x of y){ <span>@x</span><br/> } }`) as any;

    context.assert.match(node.children[0].value, /for\(const x of y\)/);

    const tags = node.children.filter(c => c instanceof TagSyntaxNode);
    context.assert.strictEqual(tags.length, 2);
    context.assert.strictEqual((tags[0] as any).children[0].children[1].children[0].value, "span");
    context.assert.strictEqual((tags[1] as any).children[0].children[1].children[0].value, "br");
});

test("BlockCodeParser: handles incomplete TypeScript block with tags", (context: TestContext) => {
    const { parserContext } = parseCode(`@{ if (condition) { <div>Missing brace`);

    context.assert.ok(parserContext.diagnostics.some(d => d.message.code === DiagnosticMessages.ExpectedBrace(" ").code));
});


test("BlockCodeParser: parses code block with deeply nested braces", (context: TestContext) => {
    const { node } = parseCode("@{ if (x) { while(y) { <span>hi</span> } } }") as any;
    const tagNodes = node.children.filter(c => c instanceof TagSyntaxNode);

    context.assert.ok(tagNodes.length > 0);
});

test("BlockCodeParser: parses nested blocks inside else", (context: TestContext) => {
    const { node } = parseCode("@{ if(a){ <b>A</b> } else { if(b){ <b>B</b> } } }") as any;

    const elseBlock = node.children[2];
    context.assert.ok(elseBlock, "Should have else node");
    context.assert.ok(elseBlock instanceof CodeValueSyntaxNode);
    context.assert.ok(node.children.some(c => c instanceof TagSyntaxNode) || node.children.some(c => c instanceof CodeValueSyntaxNode));
});

test("BlockCodeParser: parses block with else if", (context: TestContext) => {
    const { node } = parseCode("@{ if(a){<a></a>} else if(b){<b></b>} else {<c></c>} }") as any;

    context.assert.ok(node.children.some(c => c instanceof TagSyntaxNode));
    context.assert.ok(node.children.some(c => c instanceof CodeValueSyntaxNode && /else if/.test((c as any).value)));
    context.assert.ok(node.children.some(c => c instanceof CodeValueSyntaxNode && /else/.test((c as any).value)));
});

test("BlockCodeParser: parses block with catch/finally", (context: TestContext) => {
    const { node } = parseCode("@{ try {<t></t>} catch(e) {<c></c>} finally {<f></f>} }") as any;

    context.assert.ok(node.children.some(c => c instanceof CodeValueSyntaxNode && /try/.test((c as any).value)));
    context.assert.ok(node.children.some(c => c instanceof CodeValueSyntaxNode && /catch/.test((c as any).value)));
    context.assert.ok(node.children.some(c => c instanceof CodeValueSyntaxNode && /finally/.test((c as any).value)));
});

test("BlockCodeParser: parses blocks with inline else (no braces)", (context: TestContext) => {
    const { node } = parseCode("@{ if(x) <a></a> else <b></b> }") as any;

    const ifValue = node.children.find(c => c instanceof TagSyntaxNode && ((c as any).children[0].children[1].children[0].value === "a"));
    const elseValue = node.children.find(c => c instanceof TagSyntaxNode && ((c as any).children[0].children[1].children[0].value === "b"));
    context.assert.ok(ifValue, "Should parse inline if branch as tag");
    context.assert.ok(elseValue, "Should parse inline else branch as tag");
});

test("BlockCodeParser: block with interleaved tags and code", (context: TestContext) => {
    const { node } = parseCode("@{ <a></a> let a = 1; <b></b> if(x){ <c></c> } }") as any;

    context.assert.ok(node.children.some(c => c instanceof TagSyntaxNode && (c as any).children[0].children[1].children[0].value === "a"));
    context.assert.ok(node.children.some(c => c instanceof TagSyntaxNode && (c as any).children[0].children[1].children[0].value === "b"));
    context.assert.ok(node.children.some(c => c instanceof CodeValueSyntaxNode && /if\(x\)/.test((c as any).value)));

    const ifBlock = node.children.find(c => c instanceof CodeValueSyntaxNode && /if\(x\)/.test((c as any).value));
});

test("BlockCodeParser: deeply nested block with multiple tags and code", (context: TestContext) => {
    const { node } = parseCode("@{ if(a){ <x></x> if(b){ <y></y> if(c){ <z></z> } } } <root></root> }") as any;

    const rootTag = node.children.find(c => c instanceof TagSyntaxNode && (c as any).children[0].children[1].children[0].value === "root");
    context.assert.ok(rootTag, "Should have <root> tag at root level");

    let block = node.children.find(c => c instanceof CodeValueSyntaxNode && /if\(a\)/.test((c as any).value));
    context.assert.ok(block, "Should find if(a) block");

    block = node.children.find(c => c instanceof CodeValueSyntaxNode && /if\(b\)/.test((c as any).value));
    context.assert.ok(block, "Should find if(b) block");

    block = node.children.find(c => c instanceof CodeValueSyntaxNode && /if\(c\)/.test((c as any).value));
    context.assert.ok(block, "Should find if(c) block");

    context.assert.ok(node.children.some(c => c instanceof TagSyntaxNode && (c as any).children[0].children[1].children[0].value === "z"));
});

test("BlockCodeParser: parses block with empty else", (context: TestContext) => {
    const { node } = parseCode("@{ if(a){ <x></x> } else {} }") as any;
    const elseBlock = node.children.find(c => c instanceof CodeValueSyntaxNode && /else/.test((c as any).value));

    context.assert.ok(elseBlock, "Should have empty else block");
});

test("BlockCodeParser: single quotes do not break parsing", (context: TestContext) => {
    const { node } = parseCode("@{ let s = 'a <b>should not be tag</b>'; <div>real</div> }") as any;

    context.assert.ok(node.children.some(child => child instanceof TagSyntaxNode));
    context.assert.ok((node.children[0] as any).value.includes("should not be tag"));
});

test("BlockCodeParser: double quotes do not break parsing", (context: TestContext) => {
    const { node } = parseCode('@{ let s = "b <c>still not a tag</c>"; <div>real2</div> }') as any;

    context.assert.ok(node.children.some(child => child instanceof TagSyntaxNode));
    context.assert.ok((node.children[0] as any).value.includes("still not a tag"));
});

test("BlockCodeParser: backtick quotes do not break parsing", (context: TestContext) => {
    const { node } = parseCode("@{ let s = `<e>notatag</e>`; <div>real3</div> }") as any;

    context.assert.ok(node.children.some(child => child instanceof TagSyntaxNode));
    context.assert.ok((node.children[0] as any).value.includes("notatag"));
});

test("BlockCodeParser: escaped quotes inside string", (context: TestContext) => {
    const { node } = parseCode('@{ let s = "foo \\"<d>\\""; <div>real4</div> }') as any;

    context.assert.ok(node.children.some(child => child instanceof TagSyntaxNode));
    context.assert.ok((node.children[0] as any).value.includes('\\"<d>\\"'));
});

test("BlockCodeParser: multiple types of quotes in one block", (context: TestContext) => {
    const { node } = parseCode(`@{ let a = '"', b = "'<e>'", c = \`<f>template</f>\`; <div>real5</div> }`) as any;

    context.assert.ok(node.children.some(child => child instanceof TagSyntaxNode));
    context.assert.ok((node.children[0] as any).value.includes("'<e>'"));
    context.assert.ok((node.children[0] as any).value.includes("<f>template</f>"));
});

test("BlockCodeParser: unclosed quote does not trigger tag parsing", (context: TestContext) => {
    const { node, parserContext } = parseCode("@{ let x = '<div'; <span>real6</span> }") as any;

    context.assert.ok(node.children.some(child => child instanceof TagSyntaxNode), "Should parse <span> tag despite previous unclosed quote");
    context.assert.ok((node.children[0] as any).value.includes("'<div'"));
});

test("BlockCodeParser: tag with quoted attributes", (context: TestContext) => {
    const { node } = parseCode("@{ <div data-x='<b>not a tag</b>'>attr test</div> }") as any;
    const divTag = node.children.find(c => c instanceof TagSyntaxNode);

    context.assert.ok(divTag, "Should parse <div> tag correctly with quoted attribute");
});

test("BlockCodeParser: tag inside string inside block", (context: TestContext) => {
    const { node } = parseCode("@{ let code = '<b>not real</b>'; let real = 42; <b>real</b> }") as any;
    const bTag = node.children.find(c => c instanceof TagSyntaxNode);

    context.assert.ok(bTag, "Should parse <b>real</b> tag");
    context.assert.ok((node.children[0] as any).value.includes("<b>not real</b>"));
});
