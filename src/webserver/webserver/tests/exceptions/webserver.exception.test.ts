/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { SystemException } from '@contextjs/system';
import test, { TestContext } from 'node:test';
import { WebServerException } from '../../src/exceptions/webserver.exception.js';

test('WebServerException: instance and inheritance', (context: TestContext) => {
    const exception = new WebServerException();

    context.assert.ok(exception instanceof WebServerException);
    context.assert.ok(exception instanceof SystemException);
    context.assert.ok(exception instanceof Error);
});

test('WebServerException: name property', (context: TestContext) => {
    const exception = new WebServerException();

    context.assert.strictEqual(exception.name, 'WebServerException');
});

test('WebServerException: default message', (context: TestContext) => {
    const exception = new WebServerException();

    context.assert.strictEqual(exception.message, 'Web Server encountered an unknown exception.');
});

test('WebServerException: custom message', (context: TestContext) => {
    const exception = new WebServerException('Something went wrong');

    context.assert.strictEqual(exception.message, 'Something went wrong');
});

test('WebServerException: toString output', (context: TestContext) => {
    const defaultException = new WebServerException();
    const customException = new WebServerException('Something went wrong');

    context.assert.strictEqual(defaultException.toString(), 'WebServerException: Web Server encountered an unknown exception.');
    context.assert.strictEqual(customException.toString(), 'WebServerException: Something went wrong');
});

test('WebServerException: supports cause', (context: TestContext) => {
    const cause = new Error('Underlying error');
    const exception = new WebServerException('With cause', { cause });

    context.assert.strictEqual(exception.cause, cause);
});