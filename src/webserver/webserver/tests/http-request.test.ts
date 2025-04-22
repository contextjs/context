/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { IncomingMessage } from 'node:http';
import { HttpRequest } from '../src/http-request.js';
import { IHttpRequest } from '../src/interfaces/i-http-request.js';

test('HttpRequest: initializes properties from IncomingMessage', (context: TestContext) => {
    const message = new IncomingMessage(null!);
    message.method = 'GET';
    message.url = '/index';
    message.httpVersion = '1.1';
    message.statusCode = 200;
    message.statusMessage = 'OK';
    message.headers = {
        host: 'localhost',
        'content-type': 'application/json'
    };

    const request: IHttpRequest = new HttpRequest(message);

    context.assert.strictEqual(request.httpMethod, 'GET');
    context.assert.strictEqual(request.url, '/index');
    context.assert.strictEqual(request.httpVersion, '1.1');
    context.assert.strictEqual(request.statusCode, 200);
    context.assert.strictEqual(request.statusMessage, 'OK');
    context.assert.strictEqual(request.host, 'localhost');

    const headerNames = request.headers.map(h => h.name.toLowerCase());
    context.assert.ok(headerNames.includes('host'));
    context.assert.ok(headerNames.includes('content-type'));
});