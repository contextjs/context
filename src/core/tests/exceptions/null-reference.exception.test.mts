/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/context-js/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { Exception } from '../../src/exceptions/exception.mjs';
import { NullReferenceException } from '../../src/exceptions/null-reference.exception.mjs';

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

test('NullReferenceException: toString - success', (context: TestContext) => {
    const exception = new NullReferenceException();
    context.assert.strictEqual(exception.toString(), "Exception: The specified reference is null or undefined.");
});