/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/context-js/context/blob/main/LICENSE
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

test('StringExtensions: isNullOrWhiteSpace - success', (context: TestContext) => {
    const value = " ";
    context.assert.strictEqual(StringExtensions.isNullOrWhiteSpace(value), true);
});

test('StringExtensions: isNullOrWhiteSpace - failure', (context: TestContext) => {
    const value = "a";
    context.assert.strictEqual(StringExtensions.isNullOrWhiteSpace(value), false);
});

test('StringExtensions:  removeWhiteSpaces - success', (context: TestContext) => {
    const value = "a b c";
    context.assert.strictEqual(StringExtensions.removeWhiteSpaces(value), "abc");
});

test('StringExtensions: removeWhiteSpaces - failure', (context: TestContext) => {
    const value = "a b c";
    context.assert.notStrictEqual(StringExtensions.removeWhiteSpaces(value), "a b c");
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
    context.assert.strictEqual(StringExtensions.isWhiteSpace(value), true);

    value = "a";
    context.assert.strictEqual(StringExtensions.isWhiteSpace(value), false);
});

test('StringExtensions: isWhitespace - failure', (context: TestContext) => {
    const value = "a";
    context.assert.strictEqual(StringExtensions.isWhiteSpace(value), false);
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