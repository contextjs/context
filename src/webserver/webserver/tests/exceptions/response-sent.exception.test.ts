/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { ResponseSentException } from '../../src/exceptions/response-sent.exception.js';
import { WebServerException } from '../../src/exceptions/webserver.exception.js';

test('ResponseSentException: instance and inheritance', (context: TestContext) => {
    const exception = new ResponseSentException();

    context.assert.ok(exception instanceof ResponseSentException);
    context.assert.ok(exception instanceof WebServerException);
    context.assert.ok(exception instanceof Error);
});

test('ResponseSentException: name property', (context: TestContext) => {
    const exception = new ResponseSentException();

    context.assert.strictEqual(exception.name, 'ResponseSentException');
});

test('ResponseSentException: message formatting', (context: TestContext) => {
    const defaultException = new ResponseSentException();
    const customException = new ResponseSentException('Cannot send twice');
    
    context.assert.strictEqual(defaultException.message, 'Response has already been sent');
    context.assert.strictEqual(customException.message, 'Cannot send twice');
});

test('ResponseSentException: toString output', (context: TestContext) => {
    const defaultException = new ResponseSentException();
    const customException = new ResponseSentException('Cannot send twice');

    context.assert.strictEqual(customException.toString(), 'ResponseSentException: Cannot send twice');
    context.assert.strictEqual(defaultException.toString(), 'ResponseSentException: Response has already been sent');
});