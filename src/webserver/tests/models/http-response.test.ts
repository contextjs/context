/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { IncomingMessage, ServerResponse } from 'node:http';
import { test, TestContext } from 'node:test';
import { HttpResponse } from '../../src/http-response';
import { HttpResponseBuffer } from '../../src/models/http-response-buffer';
import { IHttpResponse } from '../../src/models/interfaces/i-http-response';

test('end_Success', (context: TestContext) => {
    const incomingMessage: IncomingMessage = new IncomingMessage(null!);
    const serverResponse: ServerResponse = new ServerResponse(incomingMessage);
    const httpResponse: IHttpResponse = new HttpResponse(serverResponse);
    httpResponse.setHeader('Content-Type', 'text/plain');

    httpResponse.end();

    context.assert.notStrictEqual(httpResponse, null);
});

test('write_Success', (context: TestContext) => {
    const incomingMessage: IncomingMessage = new IncomingMessage(null!);
    const serverResponse: ServerResponse = new ServerResponse(incomingMessage);
    const httpResponse: IHttpResponse = new HttpResponse(serverResponse);
    const buffer: HttpResponseBuffer = new HttpResponseBuffer('Hello World!', 'utf-8');

    httpResponse.write(buffer.value, buffer.encoding);
    context.assert.strictEqual((httpResponse as any).buffer[0].value, buffer.value);
    context.assert.strictEqual((httpResponse as any).buffer[0].encoding, buffer.encoding);

    httpResponse.end();
});

test('streamAsync_Success', (context: TestContext) => {
    const incomingMessage: IncomingMessage = new IncomingMessage(null!);
    const serverResponse: ServerResponse = new ServerResponse(incomingMessage);
    const httpResponse: IHttpResponse = new HttpResponse(serverResponse);

    context.assert.ok(httpResponse.streamAsync("test.txt"));
});

test('setHeader_Success', (context: TestContext) => {
    const incomingMessage: IncomingMessage = new IncomingMessage(null!);
    const serverResponse: ServerResponse = new ServerResponse(incomingMessage);
    const httpResponse: IHttpResponse = new HttpResponse(serverResponse);

    httpResponse.setHeader('Content-Type', 'text/plain');

    context.assert.strictEqual((httpResponse as any).headers[0].name, 'Content-Type');
});