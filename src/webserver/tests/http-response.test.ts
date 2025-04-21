/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { IncomingMessage, ServerResponse } from 'node:http';
import { test, TestContext } from 'node:test';
import { HttpResponse } from '../src/http-response';
import { IHttpResponse } from '../src/interfaces/i-http-response';
import { HttpResponseBuffer } from '../src/models/http-response-buffer';

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

    const responseHeaders = (httpResponse as any);
    const header = responseHeaders.headers.get('Content-Type');

    context.assert.strictEqual(header.value, 'text/plain');
});

test('HttpResponse: appendHeader combines multiple values', (context: TestContext) => {
    const response = new HttpResponse({ setHeader: () => { }, end: () => { } } as any);
    response.appendHeader('Set-Cookie', 'a=1');
    response.appendHeader('Set-Cookie', 'b=2');

    const header = (response as any).headers.get('Set-Cookie');
    context.assert.deepStrictEqual(header?.value, ['a=1', 'b=2']);
});

test('HttpResponse: flush - success', (context: TestContext) => {
    const written: any[] = [];
    const headersSet: Record<string, any> = {};

    const mockServerResponse = {
        headersSent: false,
        statusCode: 0,
        setHeader: (name: string, value: any) => headersSet[name] = value,
        write: (value: any, encoding?: BufferEncoding) => written.push({ value, encoding }),
        end: () => written.push('end')
    };

    const response = new HttpResponse(mockServerResponse as any);
    response.setHeader('X-Test', 'value');
    response.write('Hello World', 'utf8');
    response.flush();

    context.assert.equal(mockServerResponse.statusCode, 200);
    context.assert.deepEqual(headersSet, { 'X-Test': 'value' });
    context.assert.deepEqual(written, [
        { value: 'Hello World', encoding: 'utf8' }
    ]);
});