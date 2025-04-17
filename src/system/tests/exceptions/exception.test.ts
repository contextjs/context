/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { Exception } from '../../src/exceptions/exception.ts';

test('Exception: instance - success', (context: TestContext) => {
    const exception = new Exception("Test Exception");
    context.assert.ok(exception instanceof Exception);
    context.assert.ok(exception instanceof Error); // ensure base class
});

test('Exception: name - success', (context: TestContext) => {
    const exception = new Exception("Test Exception");
    context.assert.strictEqual(exception.name, "Exception");
});

test('Exception: message - success', (context: TestContext) => {
    const exception = new Exception("Test Exception");
    context.assert.strictEqual(exception.message, "Test Exception");
});

test('Exception: toString - success', (context: TestContext) => {
    const exception = new Exception("Test Exception");
    context.assert.strictEqual(exception.toString(), "Exception: Test Exception");
});

test('Exception: supports cause', (context: TestContext) => {
    const original = new Error("Original cause");
    const exception = new Exception("With cause", { cause: original });
    context.assert.strictEqual(exception.cause, original);
});
