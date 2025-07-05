/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { StringExtensions } from "../../src/extensions/string.extensions.ts";

test('StringExtensions: empty - success', (context: TestContext) => {
    const value = StringExtensions.empty;
    context.assert.strictEqual(value, "");
});

test('StringExtensions: empty - failure', (context: TestContext) => {
    const value = StringExtensions.empty;
    context.assert.notStrictEqual(value, " ");
});

test('StringExtensions: isNullOrEmpty - success', (context: TestContext) => {
    const value = "";
    context.assert.strictEqual(StringExtensions.isNullOrEmpty(value), true);

    const value2 = null;
    context.assert.strictEqual(StringExtensions.isNullOrEmpty(value2), true);

    const value3 = undefined;
    context.assert.strictEqual(StringExtensions.isNullOrEmpty(value3), true);
});

test('StringExtensions: isNullOrEmpty - failure', (context: TestContext) => {
    const value = "a";
    context.assert.strictEqual(StringExtensions.isNullOrEmpty(value), false);
});

test('StringExtensions: isNullOrUndefined - success', (context: TestContext) => {
    let value: string | null | undefined = " ";
    context.assert.strictEqual(StringExtensions.isNullOrUndefined(value), false);

    value = null;
    context.assert.strictEqual(StringExtensions.isNullOrUndefined(value), true);

    value = undefined;
    context.assert.strictEqual(StringExtensions.isNullOrUndefined(value), true);
});

test('StringExtensions: isNullOrUndefined - failure', (context: TestContext) => {
    const value = "a";
    context.assert.strictEqual(StringExtensions.isNullOrUndefined(value), false);
});

test('StringExtensions: isNullOrWhitespace - success', (context: TestContext) => {
    const value = " ";
    context.assert.strictEqual(StringExtensions.isNullOrWhitespace(value), true);
});

test('StringExtensions: isNullOrWhitespace - failure', (context: TestContext) => {
    const value = "a";
    context.assert.strictEqual(StringExtensions.isNullOrWhitespace(value), false);
});

test('StringExtensions:  removeWhitespace - success', (context: TestContext) => {
    const value = "a b c";
    context.assert.strictEqual(StringExtensions.removeWhitespace(value), "abc");
});

test('StringExtensions: removeWhitespace - failure', (context: TestContext) => {
    const value = "a b c";
    context.assert.notStrictEqual(StringExtensions.removeWhitespace(value), "a b c");
});

test('StringExtensions: isLineBreak - success', (context: TestContext) => {
    let value = " ";
    context.assert.strictEqual(StringExtensions.isLineBreak(value), false);

    value = "\r";
    context.assert.strictEqual(StringExtensions.isLineBreak(value), true);

    value = "\n";
    context.assert.strictEqual(StringExtensions.isLineBreak(value), true);

    value = "\u0085";
    context.assert.strictEqual(StringExtensions.isLineBreak(value), true);

    value = "\u2028";
    context.assert.strictEqual(StringExtensions.isLineBreak(value), true);
});

test('StringExtensions: isLineBreak - failure', (context: TestContext) => {
    const value = "a";
    context.assert.strictEqual(StringExtensions.isLineBreak(value), false);
});

test('StringExtensions: isDigit - success', (context: TestContext) => {
    let value = "1";
    context.assert.strictEqual(StringExtensions.isDigit(value), true);

    value = "a";
    context.assert.strictEqual(StringExtensions.isDigit(value), false);
});

test('StringExtensions: isDigit - failure', (context: TestContext) => {
    const value = "a";
    context.assert.strictEqual(StringExtensions.isDigit(value), false);
});

test('StringExtensions: isLetter - success', (context: TestContext) => {
    let value = "a";
    context.assert.strictEqual(StringExtensions.isLetter(value), true);

    value = "1";
    context.assert.strictEqual(StringExtensions.isLetter(value), false);
});

test('StringExtensions: isLetter - failure', (context: TestContext) => {
    const value = "1";
    context.assert.strictEqual(StringExtensions.isLetter(value), false);
});

test('StringExtensions: isLetterOrDigit - success', (context: TestContext) => {
    let value = "a";
    context.assert.strictEqual(StringExtensions.isLetterOrDigit(value), true);

    value = "1";
    context.assert.strictEqual(StringExtensions.isLetterOrDigit(value), true);

    value = " ";
    context.assert.strictEqual(StringExtensions.isLetterOrDigit(value), false);
});

test('StringExtensions: isLetterOrDigit - failure', (context: TestContext) => {
    const value = " ";
    context.assert.strictEqual(StringExtensions.isLetterOrDigit(value), false);
});

test('StringExtensions: isWhitespace - success', (context: TestContext) => {
    let value = " ";
    context.assert.strictEqual(StringExtensions.isWhitespace(value), true);

    value = "a";
    context.assert.strictEqual(StringExtensions.isWhitespace(value), false);
});

test('StringExtensions: isWhitespace - failure', (context: TestContext) => {
    const value = "a";
    context.assert.strictEqual(StringExtensions.isWhitespace(value), false);
});

test('StringExtensions: containsOnlyWhitespace - success', (context: TestContext) => {
    let value = " \n\r";
    context.assert.strictEqual(StringExtensions.containsOnlyWhitespace(value), true);

    value = "a";
    context.assert.strictEqual(StringExtensions.containsOnlyWhitespace(value), false);

    value = "\u2028";
    context.assert.strictEqual(StringExtensions.containsOnlyWhitespace(value), true);

    value = "\u2029";
    context.assert.strictEqual(StringExtensions.containsOnlyWhitespace(value), true);

    value = " \u2028";
    context.assert.strictEqual(StringExtensions.containsOnlyWhitespace(value), true);

    value = "\u2028 ";
    context.assert.strictEqual(StringExtensions.containsOnlyWhitespace(value), true);
});

test('StringExtensions: format - success', (context: TestContext) => {
    const template = "Hello {0}{1}";
    const world = "World";
    const exclamation = "!";
    context.assert.strictEqual(StringExtensions.format(template, world, exclamation), "Hello World!");
});

test('StringExtensions: format - failure', (context: TestContext) => {
    const template = "Hello {0}{1}";
    const world = "World";
    const exclamation = "!";
    context.assert.notStrictEqual(StringExtensions.format(template, world, exclamation), "Hello World");
});

test('StringExtensions: type narrowing - isNullOrEmpty', (context: TestContext) => {
    const value: string | null | undefined = "contextjs";

    if (!StringExtensions.isNullOrEmpty(value)) {
        const upper = value.toUpperCase();
        context.assert.strictEqual(upper, "CONTEXTJS");
    } else
        context.assert.ok(true);
});

test('StringExtensions: type narrowing - isNullOrWhitespace', (context: TestContext) => {
    const value: string | null | undefined = "ContextJS";

    if (!StringExtensions.isNullOrWhitespace(value)) {
        const first = value.charAt(0);
        context.assert.strictEqual(first, "C");
    }
    else
        context.assert.ok(true);
});

test('StringExtensions: format - unmatched placeholder returns original', (context: TestContext) => {
    const template = "Hello {0}{1}{2}";
    const world = "World";
    const exclamation = "!";
    context.assert.strictEqual(StringExtensions.format(template, world, exclamation), "Hello World!{2}");
});

test('StringExtensions: format - all placeholders unmatched', (context: TestContext) => {
    const template = "{0}{1}{2}";

    context.assert.strictEqual(StringExtensions.format(template), "{0}{1}{2}");
});

test('StringExtensions: escape - backslash', (context: TestContext) => {
    const input = "a\\b";
    const result = StringExtensions.escape(input);

    context.assert.strictEqual(result, "a\\\\b");
});

test('StringExtensions: escape - double quote', (context: TestContext) => {
    const input = 'a"b"c';
    const result = StringExtensions.escape(input);

    context.assert.strictEqual(result, 'a\\"b\\"c');
});

test("StringExtensions: escape - single quote", (context: TestContext) => {
    const input = "a'b'c";
    const result = StringExtensions.escape(input);

    context.assert.strictEqual(result, "a\\'b\\'c");
});

test("StringExtensions: escape - backtick", (context: TestContext) => {
    const input = "a`b`c";
    const result = StringExtensions.escape(input);

    context.assert.strictEqual(result, "a\\`b\\`c");
});

test("StringExtensions: escape - template literal start (${)", (context: TestContext) => {
    const input = "foo${bar}";
    const result = StringExtensions.escape(input);

    context.assert.strictEqual(result, "foo\\${bar}");
});

test("StringExtensions: escape - all at once", (context: TestContext) => {
    const input = 'a\\b"c\'d`e${f}';
    const result = StringExtensions.escape(input);

    context.assert.strictEqual(result, 'a\\\\b\\"c\\\'d\\`e\\${f}');
});

test("StringExtensions: escape - nothing to escape", (context: TestContext) => {
    const input = "abc123";
    const result = StringExtensions.escape(input);

    context.assert.strictEqual(result, "abc123");
});

test("StringExtensions: escape - already escaped ${ is not double-escaped", (context: TestContext) => {
    const input = "foo\\${bar}";
    const result = StringExtensions.escape(input);

    context.assert.strictEqual(result, "foo\\\\${bar}");
});