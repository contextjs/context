/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { MiddlewareException } from '../../src/exceptions/middleware.exception.js';
import { WebServerException } from '../../src/exceptions/webserver.exception.js';

test('MiddlewareException: instance and inheritance', (context: TestContext) => {
    const exception = new MiddlewareException();

    context.assert.ok(exception instanceof MiddlewareException);
    context.assert.ok(exception instanceof WebServerException);
    context.assert.ok(exception instanceof Error);
});

test('MiddlewareException: name property', (context: TestContext) => {
    const exception = new MiddlewareException();
    context.assert.strictEqual(exception.name, 'MiddlewareException');
});

test('MiddlewareException: message formatting', (context: TestContext) => {
    const defaultException = new MiddlewareException();
    const customException = new MiddlewareException('Custom error');

    context.assert.strictEqual(defaultException.message, 'Middleware exception');
    context.assert.strictEqual(customException.message, 'Custom error');
});

test('MiddlewareException: toString output', (context: TestContext) => {
    const defaultException = new MiddlewareException();
    const customException = new MiddlewareException('Custom error');

    context.assert.strictEqual(defaultException.toString(), 'MiddlewareException: Middleware exception');
    context.assert.strictEqual(customException.toString(), 'MiddlewareException: Custom error');
});