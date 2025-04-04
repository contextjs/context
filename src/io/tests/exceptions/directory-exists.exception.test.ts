/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { DirectoryExistsException } from '../../src/exceptions/directory-exists.exception.ts';

test('DirectoryExistsException: instance - success', (context: TestContext) => {
    const exception = new DirectoryExistsException("directory");
    context.assert.ok(exception instanceof DirectoryExistsException);
});

test('DirectoryExistsException: message - success', (context: TestContext) => {
    const exception = new DirectoryExistsException("directory");
    context.assert.strictEqual(exception.message, "The specified directory already exists: directory");
});

test('DirectoryExistsException: toString - success', (context: TestContext) => {
    const exception = new DirectoryExistsException("directory");
    context.assert.strictEqual(exception.toString(), "DirectoryExistsException: The specified directory already exists: directory");
});