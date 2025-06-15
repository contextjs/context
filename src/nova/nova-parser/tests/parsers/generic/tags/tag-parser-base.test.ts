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
import { TagParserBase } from "../../../../src/parsers/generic/tags/tag-parser-base.js";
import { Source } from "../../../../src/sources/source.js";
import { TestParser } from "../../../_fixtures/parsers-fixtures.js";

class TestableTagParserBase extends TagParserBase {
    public static testTagNameStopPredicate(context: ParserContext): boolean {
        return this.tagNameStopPredicate(context);
    }

    public static testGetTagName(context: ParserContext): string {
        return this.getTagName(context);
    }

    public static testIsValidTag(tagText: string): boolean {
        return this.isValidTag(tagText);
    }
}

test("TagParserBase: isValidTag allows valid HTML-like names", (context: TestContext) => {
    context.assert.strictEqual(TestableTagParserBase.testIsValidTag("<foo-bar>"), true);
    context.assert.strictEqual(TestableTagParserBase.testIsValidTag("<emoji😀>"), true);
    context.assert.strictEqual(TestableTagParserBase.testIsValidTag("<a1-b2.c3:d4>"), true);
});

test("TagParserBase: isValidTag rejects invalid tag formats", (context: TestContext) => {
    context.assert.strictEqual(TestableTagParserBase.testIsValidTag("</div>"), false);
    context.assert.strictEqual(TestableTagParserBase.testIsValidTag("<>"), false);
    context.assert.strictEqual(TestableTagParserBase.testIsValidTag("<  div>"), false);
    context.assert.strictEqual(TestableTagParserBase.testIsValidTag("<123abc>"), false);
});

test("TagParserBase: getTagName returns valid tag name", (context: TestContext) => {
    const parserContext = new ParserContext(new Source("div>"), TestParser);
    const name = TestableTagParserBase.testGetTagName(parserContext);

    context.assert.strictEqual(name, "div");
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
});

test("TagParserBase: getTagName emits diagnostic for empty name", (context: TestContext) => {
    const parserContext = new ParserContext(new Source(">"), TestParser);
    const name = TestableTagParserBase.testGetTagName(parserContext);

    context.assert.strictEqual(name, "");
    context.assert.ok(parserContext.diagnostics.some(d => d.message.code === DiagnosticMessages.UnexpectedEndOfInput.code));
});

test("TagParserBase: getTagName emits diagnostic for invalid name", (context: TestContext) => {
    const parserContext = new ParserContext(new Source("123abc>"), TestParser);
    const name = TestableTagParserBase.testGetTagName(parserContext);

    context.assert.strictEqual(name, "");
    context.assert.ok(parserContext.diagnostics.some(d => d.message.code === DiagnosticMessages.InvalidTagName("123abc").code));
});

test("TagParserBase: tagNameStopPredicate returns true for stop characters", (context: TestContext) => {
    const stopChars = ["=", "/", ">", "'", '"', " "];

    for (const char of stopChars) {
        const parserContext = new ParserContext(new Source(char), TestParser);
        context.assert.strictEqual(TestableTagParserBase.testTagNameStopPredicate(parserContext), true);
    }
});

test("TagParserBase: tagNameStopPredicate returns false for normal characters", (context: TestContext) => {
    const parserContext = new ParserContext(new Source("x"), TestParser);

    context.assert.strictEqual(TestableTagParserBase.testTagNameStopPredicate(parserContext), false);
});
