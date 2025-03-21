/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/context-js/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { Exception } from '../../src/exceptions/exception.ts';
import { FileNotFoundException } from '../../src/exceptions/file-not-found.exception.ts';

test('FileNotFoundException: instance - success', (context: TestContext) => {
    const exception = new FileNotFoundException("file");
    context.assert.ok(exception instanceof FileNotFoundException);
    context.assert.ok(exception instanceof Exception);
    context.assert.ok(exception instanceof Error);
});

test('FileNotFoundException: message - success', (context: TestContext) => {
    const exception = new FileNotFoundException("file");
    context.assert.strictEqual(exception.message, "The specified file was not found: file");
});

test('FileNotFoundException: toString - success', (context: TestContext) => {
    const exception = new FileNotFoundException("file");
    context.assert.strictEqual(exception.toString(), "Exception: The specified file was not found: file");
});