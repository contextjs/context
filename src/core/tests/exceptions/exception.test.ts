/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/context-js/context/blob/main/LICENSE
 */

import { Exception } from '../../src/exceptions/exception.ts';
import test, { TestContext } from 'node:test';

test('Exception: instance - success', (context: TestContext) => {
    const exception = new Exception("Test Exception");
    context.assert.ok(exception instanceof Exception);
});

test('Exception: message - success', (context: TestContext) => {
    const exception = new Exception("Test Exception");
    context.assert.strictEqual(exception.message, "Test Exception");
});

test('Exception: toString - success', (context: TestContext) => {
    const exception = new Exception("Test Exception");
    context.assert.strictEqual(exception.toString(), "Exception: Test Exception");
});