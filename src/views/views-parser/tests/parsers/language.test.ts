/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { Language, LanguageExtensions } from "../../src/parsers/language.js";

test("LanguageExtensions.fromString: returns correct enum for 'tshtml'", (context: TestContext) => {
    context.assert.strictEqual(LanguageExtensions.fromString("tshtml"), Language.TSHTML);
    context.assert.strictEqual(LanguageExtensions.fromString("TSHTML"), Language.TSHTML);
    context.assert.strictEqual(LanguageExtensions.fromString(" tshtml "), Language.TSHTML);
});

test("LanguageExtensions.fromString: returns null for unknown or bad input", (context: TestContext) => {
    context.assert.strictEqual(LanguageExtensions.fromString("pyhtml"), null);
    context.assert.strictEqual(LanguageExtensions.fromString(""), null);
    context.assert.strictEqual(LanguageExtensions.fromString("   "), null);
    context.assert.strictEqual(LanguageExtensions.fromString(null as any), null);
    context.assert.strictEqual(LanguageExtensions.fromString(undefined as any), null);
});

test("Language: contains only expected values", (context: TestContext) => {
    const expected = ["tshtml"];
    const actual = Object.values(Language);

    context.assert.deepStrictEqual(actual.sort(), expected.sort());
});

test("LanguageExtensions.fromString: accepts only and all enum values", (context: TestContext) => {
    for (const value of Object.values(Language)) {
        context.assert.strictEqual(LanguageExtensions.fromString(value), value);
        context.assert.strictEqual(LanguageExtensions.fromString(value.toUpperCase()), value);
        context.assert.strictEqual(LanguageExtensions.fromString(` ${value} `), value);
    }

    context.assert.strictEqual(LanguageExtensions.fromString("notAParser"), null);
});

test("Language: enum keys must match expected", (context: TestContext) => {
    const expectedKeys = ["TSHTML"];
    const actualKeys = Object.keys(Language).filter(k => isNaN(Number(k)));

    context.assert.deepStrictEqual(actualKeys.sort(), expectedKeys.sort());
});