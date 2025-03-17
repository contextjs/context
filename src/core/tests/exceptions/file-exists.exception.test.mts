/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/context-js/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { Exception } from '../../src/exceptions/exception.mjs';
import { FileExistsException } from '../../src/exceptions/file-exists.exception.mjs';

test('FileExistsException: instance - success', (context: TestContext) => {
    const exception = new FileExistsException("file");
    context.assert.ok(exception instanceof FileExistsException);
    context.assert.ok(exception instanceof Exception);
});

test('FileExistsException: message - success', (context: TestContext) => {
    const exception = new FileExistsException("file");
    context.assert.strictEqual(exception.message, "The specified file already exists: file");
});

test('FileExistsException: toString - success', (context: TestContext) => {
    const exception = new FileExistsException("file");
    context.assert.strictEqual(exception.toString(), "Exception: The specified file already exists: file");
});