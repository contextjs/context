/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { Exception } from '../../src/exceptions/exception.ts';
import { NullReferenceException } from '../../src/exceptions/null-reference.exception.ts';
import { StringExtensions } from '../../src/extensions/string.extensions.ts';

test('NullReferenceException: instance - success', (context: TestContext) => {
    const exception = new NullReferenceException();
    context.assert.ok(exception instanceof NullReferenceException);
    context.assert.ok(exception instanceof Exception);
    context.assert.ok(exception instanceof Error);
});

test('NullReferenceException: message - success', (context: TestContext) => {
    const exception = new NullReferenceException();
    context.assert.strictEqual(exception.message, "The specified reference is null or undefined.");
});

test('NullReferenceException: name - success', (context: TestContext) => {
    const exception = new NullReferenceException();
    context.assert.strictEqual(exception.name, "NullReferenceException");
});

test('NullReferenceException: toString - success', (context: TestContext) => {
    const exception = new NullReferenceException();
    context.assert.strictEqual(exception.toString(), "NullReferenceException: The specified reference is null or undefined.");
});

test('NullReferenceException: throwIfNull - throws NullReferenceException', (context: TestContext) => {
    context.assert.throws(() => NullReferenceException.throwIfNull(null), NullReferenceException);
});

test('NullReferenceException: throwIfNull - does not throw on valid object', (context: TestContext) => {
    context.assert.doesNotThrow(() => NullReferenceException.throwIfNull({}));
});

test('NullReferenceException: throwIfNullOrUndefined - throws NullReferenceException', (context: TestContext) => {
    context.assert.throws(() => NullReferenceException.throwIfNullOrUndefined(null), NullReferenceException);
    context.assert.throws(() => NullReferenceException.throwIfNullOrUndefined(undefined), NullReferenceException);
});

test('NullReferenceException: throwIfNullOrUndefined - does not throw on defined value', (context: TestContext) => {
    context.assert.doesNotThrow(() => NullReferenceException.throwIfNullOrUndefined('contextjs'));
});

test('NullReferenceException: throwIfNullOrEmpty - throws NullReferenceException', (context: TestContext) => {
    context.assert.throws(() => NullReferenceException.throwIfNullOrEmpty(null), NullReferenceException);
    context.assert.throws(() => NullReferenceException.throwIfNullOrEmpty(undefined), NullReferenceException);
    context.assert.throws(() => NullReferenceException.throwIfNullOrEmpty(StringExtensions.empty), NullReferenceException);
});

test('NullReferenceException: throwIfNullOrEmpty - does not throw on valid string', (context: TestContext) => {
    context.assert.doesNotThrow(() => NullReferenceException.throwIfNullOrEmpty('contextjs'));
});

test('NullReferenceException: throwIfNullOrWhiteSpace - throws NullReferenceException', (context: TestContext) => {
    context.assert.throws(() => NullReferenceException.throwIfNullOrWhitespace(null), NullReferenceException);
    context.assert.throws(() => NullReferenceException.throwIfNullOrWhitespace(undefined), NullReferenceException);
    context.assert.throws(() => NullReferenceException.throwIfNullOrWhitespace(StringExtensions.empty), NullReferenceException);
    context.assert.throws(() => NullReferenceException.throwIfNullOrWhitespace(' '), NullReferenceException);
});

test('NullReferenceException: throwIfNullOrWhiteSpace - does not throw on non-empty string', (context: TestContext) => {
    context.assert.doesNotThrow(() => NullReferenceException.throwIfNullOrWhitespace('contextjs'));
});