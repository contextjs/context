/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Language } from "@contextjs/views";
import test, { TestContext } from "node:test";
import { ParserResolver } from "../../src/parsers/parser-resolver.js";
import { TSHTMLParser } from "../../src/parsers/tshtml/tshtml.parser.js";

test("ParserResolver: returns TSHTMLParser for Language.TSHTML", (context: TestContext) => {
    const parser = ParserResolver.resolve(Language.TSHTML);

    context.assert.strictEqual(parser, TSHTMLParser);
});

test("ParserResolver: returned parser has static parse(context) method", (context: TestContext) => {
    const parser = ParserResolver.resolve(Language.TSHTML);

    context.assert.ok(parser && typeof parser.parse === "function", "TSHTMLParser must have a static parse method");
});

test("ParserResolver: returns null for unknown language", (context: TestContext) => {
    // @ts-expect-error purposely passing an invalid value for test
    context.assert.strictEqual(ParserResolver.resolve("notalanguage"), null);
});

test("ParserResolver: returns null for undefined/null input", (context: TestContext) => {
    context.assert.strictEqual(ParserResolver.resolve(undefined as any), null);
    context.assert.strictEqual(ParserResolver.resolve(null as any), null);
});

test("ParserResolver: regression - Language enum contains only expected values", (context: TestContext) => {
    const expected = ["tshtml"];
    const actual = Object.values(Language);

    context.assert.deepStrictEqual(actual.sort(), expected.sort());
});

test("ParserResolver: regression - resolve covers all and only declared languages", (context: TestContext) => {
    for (const lang of Object.values(Language)) {
        const parser = ParserResolver.resolve(lang as Language);

        context.assert.strictEqual(parser, TSHTMLParser, `Expected TSHTMLParser for ${lang}`);
    }
});