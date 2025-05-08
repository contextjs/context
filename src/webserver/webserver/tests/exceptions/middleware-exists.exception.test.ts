/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { MiddlewareExistsException } from '../../src/exceptions/middleware-exists.exception.js';
import { WebServerException } from '../../src/exceptions/webserver.exception.js';

test('MiddlewareExistsException: instance and inheritance', (context: TestContext) => {
    const exception = new MiddlewareExistsException('auth');

    context.assert.ok(exception instanceof MiddlewareExistsException);
    context.assert.ok(exception instanceof WebServerException);
    context.assert.ok(exception instanceof Error);
});

test('MiddlewareExistsException: name property', (context: TestContext) => {
    const exception = new MiddlewareExistsException('auth');

    context.assert.strictEqual(exception.name, 'MiddlewareExistsException');
});

test('MiddlewareExistsException: message formatting', (context: TestContext) => {
    const exception = new MiddlewareExistsException('auth');

    context.assert.strictEqual(exception.message, 'Middleware "auth" already exists.');
});

test('MiddlewareExistsException: toString output', (context: TestContext) => {
    const exception = new MiddlewareExistsException('auth');
    
    context.assert.strictEqual(exception.toString(), 'MiddlewareExistsException: Middleware "auth" already exists.');
});