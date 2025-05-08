/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { PassThrough, Readable } from 'stream';
import { ResponseSentException } from '../../src/exceptions/response-sent.exception.js';
import { BufferExtensions } from '../../src/extensions/buffer.extensions.js';
import { Http1Response } from '../../src/models/http1-response.js';

test('Http1Response: initialize returns this and allows first send', (context: TestContext) => {
    const response = new Http1Response();
    const dummySocket = { cork: () => { }, write: () => { }, uncork: () => { } } as any;

    context.assert.strictEqual(response.initialize(dummySocket), response);
    context.assert.doesNotThrow(() => response.send('first'));
});

test('Http1Response: send writes header and body, default keep-alive', (context: TestContext) => {
    const writes: Buffer[] = [];
    const dummySocket = { cork: () => { }, write: (data: Buffer) => { writes.push(data); }, uncork: () => { } } as any;

    const response = new Http1Response().initialize(dummySocket);
    const body = 'BODY';
    response.send(body);

    context.assert.strictEqual(writes.length, 2);
    const [headerBuf, bodyBuf] = writes;

    context.assert.ok(bodyBuf.equals(Buffer.from(body)));
    context.assert.ok(headerBuf.includes(BufferExtensions.create('HTTP/1.1 200 OK\r\n')));
    context.assert.ok(headerBuf.includes(BufferExtensions.create('Connection: keep-alive\r\n')));
});

test('Http1Response: send honors setConnectionClose', (context: TestContext) => {
    const writes: Buffer[] = [];
    const dummySocket = { cork: () => { }, write: (data: Buffer) => { writes.push(data); }, uncork: () => { } } as any;

    const response = new Http1Response()
        .initialize(dummySocket)
        .setConnectionClose(true);
    response.send('X');
    const headerBuf = writes[0];

    context.assert.ok(headerBuf.includes(BufferExtensions.create('Connection: close\r\n')));
});

test('Http1Response: send throws ResponseSentException on second send', (context: TestContext) => {
    const dummySocket = { cork: () => { }, write: () => { }, uncork: () => { } } as any;
    const response = new Http1Response().initialize(dummySocket);
    response.send('A');

    context.assert.throws(() => response.send('B'), ResponseSentException);
});

test('Http1Response: reset allows send again after a send', (context: TestContext) => {
    const writes: Buffer[] = [];
    const dummySocket = { cork: () => { }, write: (data: Buffer) => { writes.push(data); }, uncork: () => { } } as any;

    const response = new Http1Response().initialize(dummySocket);
    response.send('ONE');

    context.assert.throws(() => response.send('TWO'), ResponseSentException);

    response.reset();

    context.assert.doesNotThrow(() => response.send('TWO'));
    context.assert.strictEqual(writes.length, 4);
});

test('Http1Response: createStatusBuffer caches buffers and handles non-default status', (context: TestContext) => {
    const response = new Http1Response();
    const buf1 = (response as any).createStatusBuffer(201, 'Created');
    const buf2 = (response as any).createStatusBuffer(201, 'Created');

    context.assert.strictEqual(buf1, buf2);
    context.assert.ok(buf1.includes(BufferExtensions.create('HTTP/1.1 201 Created\r\n')));
});

test('Http1Response: getBufferLength caches buffers for lengths', (context: TestContext) => {
    const response = new Http1Response();
    const buf1 = (response as any).getBufferLength(456);
    const buf2 = (response as any).getBufferLength(456);

    context.assert.strictEqual(buf1, buf2);
    context.assert.ok(buf1.includes(BufferExtensions.create('Content-Length: 456\r\n')));
});

test('Http1Response: setHeader returns this and normalizes number and array values', (context: TestContext) => {
    const response = new Http1Response();
    const ret = response.setHeader('X-Test', ["1", 'two', "3"]).setHeader('Y-Test', 789);
    const entries = Array.from((response as any).headers.entries());

    context.assert.strictEqual(ret, response);
    context.assert.deepEqual(entries, [['X-Test', '1, two, 3'], ['Y-Test', '789']]);
});

test('Http1Response: createHeaderBuffer omits default date header when custom date is set', (context: TestContext) => {
    const dummySocket = { cork: () => { }, write: () => { }, uncork: () => { } } as any;
    const response = new Http1Response().initialize(dummySocket);
    response.setHeader('date', 'CustomDateVal');
    const headerBuf = (response as any).createHeaderBuffer(false, 0);

    context.assert.ok(headerBuf.includes(BufferExtensions.create('date: CustomDateVal\r\n')));
    context.assert.ok(!headerBuf.includes(BufferExtensions.create('Date: ')));
});

test('Http1Response: send writes correct header and body with keep-alive', (context: TestContext) => {
    const writes: Buffer[] = [];
    const socket = { cork: () => { }, write: (buf: Buffer) => writes.push(buf), uncork: () => { } } as any;
    const response = new Http1Response().initialize(socket);
    const body = 'HELLO';
    response.send(body);
    const header = writes[0];
    const payload = writes[1];

    context.assert.equal(writes.length, 2);
    context.assert.ok(payload.equals(Buffer.from(body)));
    context.assert.ok(header.includes(BufferExtensions.create('HTTP/1.1 200 OK\r\n')));
    context.assert.ok(header.includes(BufferExtensions.create('Connection: keep-alive\r\n')));
});

test('Http1Response: send respects setConnectionClose(true)', (context: TestContext) => {
    const writes: Buffer[] = [];
    const socket = { cork: () => { }, write: (buf: Buffer) => writes.push(buf), uncork: () => { } } as any;
    const response = new Http1Response().initialize(socket).setConnectionClose(true);
    response.send('X');
    const header = writes[0];

    context.assert.ok(header.includes(BufferExtensions.create('Connection: close\r\n')));
});

test('Http1Response: second send throws ResponseSentException', (context: TestContext) => {
    const socket = { cork: () => { }, write: () => { }, uncork: () => { } } as any;
    const response = new Http1Response().initialize(socket);
    response.send('A');

    context.assert.throws(() => response.send('B'), ResponseSentException);
});

test('Http1Response: reset clears state and allows send again', (context: TestContext) => {
    const writes: Buffer[] = [];
    const socket = { cork: () => { }, write: (buf: Buffer) => writes.push(buf), uncork: () => { } } as any;
    const response = new Http1Response().initialize(socket);
    response.send('ONE');

    context.assert.throws(() => response.send('TWO'), ResponseSentException);

    response.reset();

    context.assert.doesNotThrow(() => response.send('TWO'));
    context.assert.equal(writes.length, 4);
});

test('Http1Response: createStatusBuffer caches and returns custom status', (context: TestContext) => {
    const response = new Http1Response();
    const b1 = (response as any).createStatusBuffer(201, 'Created');
    const b2 = (response as any).createStatusBuffer(201, 'Created');

    context.assert.equal(b1, b2);
    context.assert.ok(b1.includes(BufferExtensions.create('HTTP/1.1 201 Created\r\n')));
});

test('Http1Response: getBufferLength caches length buffers', (context: TestContext) => {
    const response = new Http1Response();
    const b1 = (response as any).getBufferLength(1234);
    const b2 = (response as any).getBufferLength(1234);

    context.assert.equal(b1, b2);
    context.assert.ok(b1.includes(BufferExtensions.create('Content-Length: 1234\r\n')));
});

test('Http1Response: setHeader returns this and normalizes values', (context: TestContext) => {
    const response = new Http1Response();
    const ret = response.setHeader('X', ["1", 'two', "3"]).setHeader('Y', 99);
    const entries = Array.from((response as any).headers.entries());

    context.assert.equal(ret, response);
    context.assert.deepStrictEqual(entries, [['X', '1, two, 3'], ['Y', '99']]);
});

test('Http1Response: createHeaderBuffer omits default Date if date header set', (context: TestContext) => {
    const socket = { cork: () => { }, write: () => { }, uncork: () => { } } as any;
    const response = new Http1Response().initialize(socket);
    response.setHeader('date', 'CUSTOM');
    const buf = (response as any).createHeaderBuffer(false, 0);

    context.assert.ok(buf.includes(BufferExtensions.create('date: CUSTOM\r\n')));
    context.assert.ok(!buf.includes(BufferExtensions.create('Date: ')));
});

test('Http1Response: stream writes chunked header and payload, then throws on second stream', async (context: TestContext) => {
    const writes: Buffer[] = [];
    const socket = new PassThrough();
    socket.cork = () => { };
    socket.uncork = () => { };
    socket.on('data', (c: Buffer) => writes.push(c));

    const response = new Http1Response().initialize(socket as any);
    const readable = new Readable({ read() { this.push('DATA'); this.push(null); } });

    response.stream(readable);
    await new Promise(r => setImmediate(r));
    const combined = Buffer.concat(writes.slice(1)).toString();

    context.assert.ok(writes[0].includes(BufferExtensions.create('Transfer-Encoding: chunked\r\n')));
    context.assert.ok(combined.includes('DATA'));
    context.assert.throws(() => response.stream(readable), ResponseSentException);
});

test('Http1Response: send then stream and stream then send both throw ResponseSentException', (context: TestContext) => {
    const socket1 = new PassThrough();
    socket1.cork = () => { };
    socket1.uncork = () => { };
    const response1 = new Http1Response().initialize(socket1 as any);
    response1.send('X');

    const socket2 = new PassThrough();
    socket2.cork = () => { };
    socket2.uncork = () => { };
    const response2 = new Http1Response().initialize(socket2 as any);
    response2.stream(new Readable({ read() { this.push(null); } }));

    context.assert.throws(() => response2.send('Y'), ResponseSentException);
    context.assert.throws(() => response1.stream(new Readable({ read() { this.push(null); } })), ResponseSentException);
});