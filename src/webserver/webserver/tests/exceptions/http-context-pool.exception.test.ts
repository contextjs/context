/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { HttpContextPoolException } from '../../src/exceptions/http-context-pool.exception.js';
import { WebServerException } from '../../src/exceptions/webserver.exception.js';

test('HttpContextPoolException: instance - success', (context: TestContext) => {
    const exception = new HttpContextPoolException();

    context.assert.ok(exception instanceof HttpContextPoolException);
    context.assert.ok(exception instanceof WebServerException);
    context.assert.ok(exception instanceof Error);
});

test('HttpContextPoolException: name - default', (context: TestContext) => {
    const exception = new HttpContextPoolException();

    context.assert.strictEqual(exception.name, 'HttpContextPoolException');
});

test('HttpContextPoolException: default message', (context: TestContext) => {
    const exception = new HttpContextPoolException();

    context.assert.strictEqual(exception.message, 'HTTP Context Pool exception');
});

test('HttpContextPoolException: custom message', (context: TestContext) => {
    const exception = new HttpContextPoolException('Custom message');

    context.assert.strictEqual(exception.message, 'Custom message');
});

test('HttpContextPoolException: toString default', (context: TestContext) => {
    const exception = new HttpContextPoolException();

    context.assert.strictEqual(exception.toString(), 'HttpContextPoolException: HTTP Context Pool exception');
});

test('HttpContextPoolException: supports cause', (context: TestContext) => {
    const original = new Error('Original cause');
    const exception = new HttpContextPoolException('With cause', { cause: original });

    context.assert.strictEqual(exception.cause, original);
});