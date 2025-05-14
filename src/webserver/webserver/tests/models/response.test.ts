/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ServerHttp2Stream } from 'node:http2';
import { Socket } from 'node:net';
import test, { TestContext } from 'node:test';
import { Http1Response } from '../../src/models/http1-response.js';
import { Http2Response } from '../../src/models/http2-response.js';
import { Response } from '../../src/models/response.js';

test('Respons: initialize(): returns this and delegates to correct implementation', (context: TestContext) => {
    let http1InitializeCalled = false;
    let http2InitializeCalled = false;

    const originalHttp1Initialize = Http1Response.prototype.initialize;
    const originalHttp2Initialize = Http2Response.prototype.initialize;
    Http1Response.prototype.initialize = function (socket: Socket) { http1InitializeCalled = true; return originalHttp1Initialize.call(this, socket); };
    Http2Response.prototype.initialize = function (stream: ServerHttp2Stream) { http2InitializeCalled = true; return originalHttp2Initialize.call(this, stream); };

    try {
        const responseFacade = new Response();

        const fakeSocket = {} as Socket;
        context.assert.strictEqual(responseFacade.initialize(fakeSocket), responseFacade);
        context.assert.ok(http1InitializeCalled, 'Http1Response.initialize should be called');
        context.assert.ok(!http2InitializeCalled, 'Http2Response.initialize should not be called');

        http1InitializeCalled = false;
        http2InitializeCalled = false;
        const fakeHttp2Stream = { respond() { }, end() { } } as ServerHttp2Stream;
        context.assert.strictEqual(responseFacade.initialize(fakeHttp2Stream), responseFacade);
        context.assert.ok(!http1InitializeCalled, 'Http1Response.initialize should not be called');
        context.assert.ok(http2InitializeCalled, 'Http2Response.initialize should be called');
    }
    finally {
        Http1Response.prototype.initialize = originalHttp1Initialize;
        Http2Response.prototype.initialize = originalHttp2Initialize;
    }
});

test('Response: reset(): returns this and delegates', (context: TestContext) => {
    const responseFacade = new Response();
    let http1ResetCalled = false;

    const originalHttp1Reset = Http1Response.prototype.reset;
    Http1Response.prototype.reset = function () { http1ResetCalled = true; return this; };

    try {
        context.assert.strictEqual(responseFacade.reset(), responseFacade);
        context.assert.ok(http1ResetCalled, 'Http1Response.reset should be called');
    }
    finally {
        Http1Response.prototype.reset = originalHttp1Reset;
    }

    let http2ResetCalled = false;
    const originalHttp2Reset = Http2Response.prototype.reset;
    Http2Response.prototype.reset = function () { http2ResetCalled = true; return this; };

    try {
        const fakeHttp2Stream = { respond() { }, end() { }, destroy() { } } as ServerHttp2Stream;
        responseFacade.initialize(fakeHttp2Stream);
        context.assert.strictEqual(responseFacade.reset(), responseFacade);
        context.assert.ok(http2ResetCalled, 'Http2Response.reset should be called');
    }
    finally {
        Http2Response.prototype.reset = originalHttp2Reset;
    }
});

test('Response: Fluent methods setConnectionClose, setHeader, setStatus return this', (context: TestContext) => {
    const responseFacade = new Response();
    const fakeSocket = { cork() { }, write() { }, uncork() { } } as unknown as Socket;
    responseFacade.initialize(fakeSocket);

    context.assert.strictEqual(responseFacade.setConnectionClose(true), responseFacade);

    let receivedHeaderName: string | null = null;
    let receivedHeaderValue: unknown = null;
    const originalSetHeader = Http1Response.prototype.setHeader;
    Http1Response.prototype.setHeader = function (name: string, value: unknown) { receivedHeaderName = name; receivedHeaderValue = value; return this; } as any;

    try {
        context.assert.strictEqual(responseFacade.setHeader('X-Test', 42), responseFacade);
        context.assert.strictEqual(receivedHeaderName, 'X-Test');
        context.assert.strictEqual(receivedHeaderValue, 42);
    }
    finally {
        Http1Response.prototype.setHeader = originalSetHeader;
    }

    let receivedStatusCode: number | null = null;
    let receivedStatusMessage: string | null = null;
    const originalSetStatus = Http1Response.prototype.setStatus;
    Http1Response.prototype.setStatus = function (code: number, message: string) { receivedStatusCode = code; receivedStatusMessage = message; return this; } as any;

    try {
        context.assert.strictEqual(responseFacade.setStatus(201, 'Created'), responseFacade);
        context.assert.strictEqual(receivedStatusCode, 201);
        context.assert.strictEqual(receivedStatusMessage, 'Created');
    }
    finally {
        Http1Response.prototype.setStatus = originalSetStatus;
    }
});

test('Response: sendAsync(): delegates to underlying send()', async (context: TestContext) => {
    const responseFacade = new Response();
    let http1SendCalled = false;
    let http2SendCalled = false;

    const originalHttp1Send = Http1Response.prototype.send;
    const originalHttp2Send = Http2Response.prototype.send;
    Http1Response.prototype.send = function (_body: any) { http1SendCalled = true; } as any;
    Http2Response.prototype.send = function (_body: any) { http2SendCalled = true; } as any;

    try {
        const fakeSocket = { cork() { }, write() { }, uncork() { } } as unknown as Socket;
        await responseFacade.initialize(fakeSocket).sendAsync('foo');
        context.assert.ok(http1SendCalled && !http2SendCalled, 'Http1Response.send should be called');

        http1SendCalled = false;
        http2SendCalled = false;
        const fakeHttp2Stream = { respond() { }, end() { } } as ServerHttp2Stream;
        await responseFacade.initialize(fakeHttp2Stream).sendAsync(Buffer.from('bar'));
        context.assert.ok(!http1SendCalled && http2SendCalled, 'Http2Response.send should be called');
    }
    finally {
        Http1Response.prototype.send = originalHttp1Send;
        Http2Response.prototype.send = originalHttp2Send;
    }
});

test('Response: stream(): delegates to underlying stream()', async (context: TestContext) => {
    const responseFacade = new Response();
    let http1StreamCalled = false;
    let http2StreamCalled = false;

    const originalHttp1Stream = Http1Response.prototype.stream;
    const originalHttp2Stream = Http2Response.prototype.stream;
    Http1Response.prototype.stream = function (_stream: any) { http1StreamCalled = true; } as any;
    Http2Response.prototype.stream = function (_stream: any) { http2StreamCalled = true; } as any;

    try {
        const readableStream = { once() { }, pipe() { } } as unknown as NodeJS.ReadableStream;
        const fakeSocket = { cork() { }, write() { }, uncork() { } } as unknown as Socket;
        await responseFacade.initialize(fakeSocket).streamAsync(readableStream);
        context.assert.ok(http1StreamCalled && !http2StreamCalled, 'Http1Response.stream should be called');

        http1StreamCalled = false;
        http2StreamCalled = false;
        const fakeHttp2Stream = { respond() { }, end() { }, destroy() { } } as ServerHttp2Stream;
        await responseFacade.initialize(fakeHttp2Stream).streamAsync(readableStream);
        context.assert.ok(!http1StreamCalled && http2StreamCalled, 'Http2Response.stream should be called');
    }
    finally {
        Http1Response.prototype.stream = originalHttp1Stream;
        Http2Response.prototype.stream = originalHttp2Stream;
    }
});

test('Response: onEnd callback is invoked before sendAsync', async (context: TestContext) => {
    let called = false;
    const response = new Response();
    const fakeSocket = { cork() { }, write() { }, uncork() { } } as unknown as Socket;

    await response
        .initialize(fakeSocket)
        .onEnd(() => { called = true; })
        .sendAsync('hello');

    context.assert.ok(called, 'onEnd callback should have been called before sendAsync');
});

test('Response: onEnd callback is invoked before streamAsync', async (context: TestContext) => {
    let called = false;
    const response = new Response();
    const fakeSocket = { cork() { }, write() { }, uncork() { } } as unknown as Socket;
    const fakeStream = {} as unknown as NodeJS.ReadableStream;

    const originalHttp1Stream = Http1Response.prototype.stream;
    Http1Response.prototype.stream = function (_: any) { };

    try {
        await response
            .initialize(fakeSocket)
            .onEnd(async () => { called = true; })
            .streamAsync(fakeStream);

        context.assert.ok(called, 'onEnd callback should have been called before streamAsync');
    }
    finally {
        Http1Response.prototype.stream = originalHttp1Stream;
    }
});