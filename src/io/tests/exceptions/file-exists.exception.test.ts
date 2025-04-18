/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { FileExistsException } from '../../src/exceptions/file-exists.exception.ts';

test('FileExistsException: instance - success', (context: TestContext) => {
    const exception = new FileExistsException("file.txt");
    context.assert.ok(exception instanceof FileExistsException);
});

test('FileExistsException: message - success', (context: TestContext) => {
    const exception = new FileExistsException("file.txt");
    context.assert.strictEqual(exception.message, "The specified file already exists: file.txt");
});

test('FileExistsException: name - success', (context: TestContext) => {
    const exception = new FileExistsException("file.txt");
    context.assert.strictEqual(exception.name, "FileExistsException");
});

test('FileExistsException: toString - success', (context: TestContext) => {
    const exception = new FileExistsException("file.txt");
    context.assert.strictEqual(exception.toString(), "FileExistsException: The specified file already exists: file.txt");
});