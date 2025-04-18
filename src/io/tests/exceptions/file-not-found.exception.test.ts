/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { FileNotFoundException } from '../../src/exceptions/file-not-found.exception.ts';

test('FileNotFoundException: instance - success', (context: TestContext) => {
    const exception = new FileNotFoundException("missing.txt");
    context.assert.ok(exception instanceof FileNotFoundException);
});

test('FileNotFoundException: message - success', (context: TestContext) => {
    const exception = new FileNotFoundException("missing.txt");
    context.assert.strictEqual(exception.message, "The specified file was not found: missing.txt");
});

test('FileNotFoundException: name - success', (context: TestContext) => {
    const exception = new FileNotFoundException("missing.txt");
    context.assert.strictEqual(exception.name, "FileNotFoundException");
});

test('FileNotFoundException: toString - success', (context: TestContext) => {
    const exception = new FileNotFoundException("missing.txt");
    context.assert.strictEqual(exception.toString(), "FileNotFoundException: The specified file was not found: missing.txt");
});