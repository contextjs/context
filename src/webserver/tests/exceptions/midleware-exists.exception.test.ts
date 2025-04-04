/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { test, TestContext } from 'node:test';
import { MiddlewareExistsException } from '../../src/exceptions/middleware-exists.exception.js';

test('MiddlewareExistsException - contructor - success', async (context: TestContext) => {
    const name = 'test-name';
    const exception = new MiddlewareExistsException(name);

    context.assert.strictEqual(exception.name, 'MiddlewareExistsException');
    context.assert.strictEqual(exception.message, `The specified middleware already exists: ${name}`);
});