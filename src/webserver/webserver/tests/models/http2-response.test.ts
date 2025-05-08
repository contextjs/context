/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { ResponseSentException } from '../../src/exceptions/response-sent.exception.js';
import { Http2Response } from '../../src/models/http2-response.js';

test('Http2Response: initialize: sets stream, resets state, returns this', (context: TestContext) => {
    const fakeStreamA = {} as any;
    const response = new Http2Response();
    const ret = response.initialize(fakeStreamA);
    fakeStreamA.respond = () => { };
    fakeStreamA.end = () => { };

    context.assert.strictEqual(ret, response);
    context.assert.doesNotThrow(() => response.send('ok'));
});

test('Http2Response: send: calls respond with status and headers, then end with payload', (context: TestContext) => {
    let seenHeaders: Record<string, unknown> | null = null;
    let seenPayload: Buffer | null = null;
    const fakeStream = { respond: (h: Record<string, unknown>) => { seenHeaders = h; }, end: (b: Buffer) => { seenPayload = b; } } as any;

    const response = new Http2Response().initialize(fakeStream);
    response.setStatus(201, 'Created')
        .setHeader('X-Test', 'value');
    const data = Buffer.from('HELLO');
    response.send(data);

    context.assert.ok(seenHeaders, 'respond should have been called');
    context.assert.strictEqual(seenHeaders![':status'], 201);
    context.assert.strictEqual(seenHeaders!['X-Test'], 'value');
    context.assert.ok(seenPayload);
    context.assert.ok((seenPayload as Buffer).equals(data));
});

test('Http2Response: send: skips forbidden headers', (context: TestContext) => {
    let seen: Record<string, unknown> = {};
    const fakeStream = { respond: (h: Record<string, unknown>) => { seen = h; }, end: () => { } } as any;

    const response = new Http2Response().initialize(fakeStream);
    response.setHeader('Connection', 'close')
        .setHeader('Custom', 'ok')
        .send('x');

    context.assert.ok(!('Connection' in seen), 'forbidden header should be omitted');
    context.assert.strictEqual(seen['Custom'], 'ok');
});

test('Http2Response: send: throws on second send', (context: TestContext) => {
    const fakeStream = { respond: () => { }, end: () => { } } as any;
    const response = new Http2Response().initialize(fakeStream);
    response.send('first');

    context.assert.throws(() => response.send('second'), ResponseSentException);
});

test('Http2Response: setConnectionClose no op', (context: TestContext) => {
    const fakeStream = { respond: () => { }, end: () => { } } as any;
    const response = new Http2Response().initialize(fakeStream);
    response.setConnectionClose(false);

    context.assert.doesNotThrow(() => response.send('ok'));
});

test('Http2Response: setHeader and setStatus throw after send', (context: TestContext) => {
    const fakeStream = { respond: () => { }, end: () => { } } as any;
    const response = new Http2Response().initialize(fakeStream);
    response.send('data');

    context.assert.throws(() => response.setHeader('A', 'b'), ResponseSentException);
    context.assert.throws(() => response.setStatus(418, 'Teapot'), ResponseSentException);
});

test('Http2Response: reset allows send again on same stream', (context: TestContext) => {
    let count = 0;
    const fakeStream = { respond: () => { count++; }, end: () => { count++; } } as any;

    const response = new Http2Response().initialize(fakeStream);
    response.send('one');

    context.assert.throws(() => response.send('two'), ResponseSentException);

    response.reset();
    context.assert.doesNotThrow(() => response.send('two'));
    context.assert.strictEqual(count, 4);
});

test('Http2Response: stream: calls respond and pipes into stream', (context: TestContext) => {
    let seenHeaders: Record<string, unknown> | null = null;
    let pipedTo: unknown = null;

    const fakeStream = { respond: (h: Record<string, unknown>) => { seenHeaders = h; }, } as any;
    const fakeReadable = { once: (_: string, _cb: () => void) => { }, pipe: (dest: unknown) => { pipedTo = dest; return dest; }, } as any as NodeJS.ReadableStream;

    const response = new Http2Response().initialize(fakeStream);
    response.setStatus(202, 'Accepted')
        .setHeader('X-Flag', 'yes')
        .stream(fakeReadable);

    context.assert.ok(seenHeaders, 'respond should have been called');
    context.assert.strictEqual(seenHeaders![':status'], 202);
    context.assert.strictEqual(seenHeaders!['X-Flag'], 'yes');
    context.assert.strictEqual(pipedTo, fakeStream, 'stream should pipe into HTTP/2 stream');
});