/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Socket } from 'node:net';
import { PassThrough } from 'node:stream';
import test, { TestContext } from 'node:test';
import { MiddlewareExistsException } from '../../src/exceptions/middleware-exists.exception.js';
import { HeaderCollection } from '../../src/models/header.collection.js';
import { HttpContext } from '../../src/models/http-context.js';
import { WebServerOptions } from '../../src/options/webserver-options.js';
import { ServerBase } from '../../src/services/server-base.js';

class TestServer extends ServerBase {
    constructor(options: WebServerOptions) {
        super(options as any);
    }

    public parseRequestHeadersPublic(buffer: Buffer, headers: HeaderCollection) {
        return (this as any).parseRequestHeaders(buffer, headers);
    }

    public shouldClosePublic(headers: HeaderCollection) {
        return (this as any).shouldCloseConnection(headers);
    }

    public compileMiddlewarePublic() {
        return (this as any).compileMiddleware();
    }

    public getTrackedSockets() {
        return this.sockets;
    }
}

class TestServerBase extends ServerBase {
    public writes: Buffer[] = [];
    public ends: any[] = [];

    public triggerSetIdle(): void {
        this.setIdleSocketsInterval();
    }

    public getSocketsMap(): Map<Socket, { lastActive: number }> {
        return this.sockets;
    }

    public exposeOnSocketError(error: NodeJS.ErrnoException): void {
        // @ts-ignore – calling private method for test
        this.onSocketError(error);
    }

    public exposeHandle(socket: any): void {
        // stub write and end
        socket.write = (buf: Buffer) => this.writes.push(buf);
        socket.end = (arg?: any) => this.ends.push(arg);
        socket.on = socket.addListener.bind(socket);
        super.handleSocket(socket);
    }
    public async dispatchRequestAsync(_ctx: any): Promise<void> {
        // no-op
    }
    public exposeUpdate(socket: Socket): void {
        // no-op, inherited
    }
}

const defaultOptions: WebServerOptions = new WebServerOptions();

test('ServerBase: parseRequestHeaders parses method, path, and headers correctly', (context: TestContext) => {
    const server = new TestServer(defaultOptions);
    const rawRequest = 'GET /foo HTTP/1.1\r\nHost: example.com\r\nX-Test: 42\r\n\r\n';
    const requestBuffer = Buffer.from(rawRequest, 'ascii');
    const headerCollection = new HeaderCollection();

    const { method, path, headers: parsedHeaders } = server.parseRequestHeadersPublic(requestBuffer, headerCollection);

    context.assert.strictEqual(method, 'GET');
    context.assert.strictEqual(path, '/foo');
    context.assert.strictEqual(parsedHeaders.get('host'), 'example.com');
    context.assert.strictEqual(parsedHeaders.get('x-test'), '42');
});

test('ServerBase: shouldCloseConnection respects shutdown flag', (context: TestContext) => {
    const server = new TestServer(defaultOptions);
    const headerCollection = new HeaderCollection();
    (server as any).isShuttingDown = true;

    context.assert.ok(server.shouldClosePublic(headerCollection));
});

test('ServerBase: shouldCloseConnection closes on Connection: close', (context: TestContext) => {
    const server = new TestServer(defaultOptions);
    const headerCollection = new HeaderCollection();
    headerCollection.set('Connection', 'close');

    context.assert.ok(server.shouldClosePublic(headerCollection));
});

test('ServerBase: shouldCloseConnection keeps alive by default', (context: TestContext) => {
    const server = new TestServer(defaultOptions);
    const headerCollection = new HeaderCollection();

    context.assert.strictEqual(server.shouldClosePublic(headerCollection), false);
});

test('ServerBase: useMiddleware throws on duplicate middleware names', (context: TestContext) => {
    const server = new TestServer(defaultOptions);
    const middleware = { name: 'duplicate', onRequest: (_: HttpContext) => { } };
    server.useMiddleware(middleware);

    context.assert.throws(() => server.useMiddleware(middleware), MiddlewareExistsException);
});

test('ServerBase: compileMiddleware executes chain in registration order', async (context: TestContext) => {
    const server = new TestServer(defaultOptions);
    const invocationOrder: string[] = [];

    const mwA = { name: 'A', onRequest: (_: HttpContext) => { invocationOrder.push('A'); } };
    const mwB = {
        name: 'B',
        onRequest: (_: HttpContext, next: () => Promise<void>) => {
            invocationOrder.push('B');
            return next();
        }
    };
    const mwC = { name: 'C', onRequest: async (_: HttpContext) => { invocationOrder.push('C'); } };

    server.useMiddleware(mwA);
    server.useMiddleware(mwB);
    server.useMiddleware(mwC);

    const executor = server.compileMiddlewarePublic();
    await executor(new HttpContext());

    context.assert.deepStrictEqual(invocationOrder, ['A', 'B', 'C']);
});

test('ServerBase: dispatchRequestAsync does not send error on success', async (context: TestContext) => {
    const server = new TestServer(defaultOptions);
    let middlewareInvoked = false;
    (server as any).middlewareExecutor = async (_: HttpContext) => { middlewareInvoked = true; };

    const fakeResponse = {
        setStatus: () => fakeResponse,
        setHeader: () => fakeResponse,
        send: () => { throw new Error('Unexpected send'); }
    };
    const contextObj = new HttpContext();
    (contextObj as any).response = fakeResponse;

    await server.dispatchRequestAsync(contextObj);
    context.assert.ok(middlewareInvoked);
});

test('ServerBase: dispatchRequestAsync sends 500 on middleware exception', async (context: TestContext) => {
    const server = new TestServer(defaultOptions);
    (server as any).middlewareExecutor = async () => { throw new Error('fail'); };

    let sentStatus: number | null = null;
    let sentHeaderName: string | null = null;
    let sentHeaderValue: string | null = null;
    let sentBody: string | null = null;

    const fakeResponse = {
        setStatus: (code: number, _: string) => { sentStatus = code; return fakeResponse; },
        setHeader: (name: string, value: string) => { sentHeaderName = name; sentHeaderValue = value; return fakeResponse; },
        sendAsync: async (body: string) => { sentBody = body; }
    };
    const contextObj = new HttpContext();
    (contextObj as any).response = fakeResponse;

    await server.dispatchRequestAsync(contextObj);

    context.assert.strictEqual(sentStatus, 500);
    context.assert.strictEqual(sentHeaderName, 'Content-Type');
    context.assert.strictEqual(sentHeaderValue, 'text/plain');
    context.assert.strictEqual(sentBody, 'Internal Server Error');
});

test('ServerBase: updateSocketLastActive refreshes lastActive timestamp', (context: TestContext) => {
    const server = new TestServer(defaultOptions);
    const clientSocket = {} as Socket;
    server.getTrackedSockets().set(clientSocket, { lastActive: 0 });
    (server as any).updateSocketLastActive(clientSocket);
    const record = server.getTrackedSockets().get(clientSocket)!;

    context.assert.ok(record.lastActive > 0);
});

test('ServerBase: updateSocketLastActive no-op for untracked sockets', (context: TestContext) => {
    const server = new TestServer(defaultOptions);
    const unknownSocket = {} as Socket;

    context.assert.doesNotThrow(() => (server as any).updateSocketLastActive(unknownSocket));
});

test('ServerBase: setIdleSocketsInterval closes idle sockets and emits info events', (context: TestContext) => {
    const events: any[] = [];
    const options = {
        http: { keepAliveTimeout: 50 },
        general: { idleSocketsTimeout: 10, httpContextPoolSize: 1 },
        onEvent: (e: any) => events.push(e)
    } as any as WebServerOptions;

    let intervalCb: () => void;
    let intervalMs: number;
    const originalSetInterval = global.setInterval;
    (global as any).setInterval = (cb: any, ms: number) => {
        intervalCb = cb;
        intervalMs = ms;
        return 123 as any;
    };

    const server = new TestServerBase(options);
    server.triggerSetIdle();

    global.setInterval = originalSetInterval;

    context.assert.strictEqual(intervalMs!, options.general.idleSocketsTimeout);

    const fakeSocket = new PassThrough() as any as Socket;
    let destroyed = false;
    (fakeSocket as any).destroy = () => { destroyed = true; };
    const oldLastActive = Date.now() - (options.http.keepAliveTimeout + 10);
    server.getSocketsMap().set(fakeSocket, { lastActive: oldLastActive });

    intervalCb!();

    context.assert.ok(destroyed);
    context.assert.strictEqual(server.getSocketsMap().has(fakeSocket), false);
    context.assert.ok(events.some(e => e.type === 'info' && /Closing idle socket/.test(e.detail)));
});

test('ServerBase: onSocketError emits error event for unexpected codes and ignores known codes', (context: TestContext) => {
    const events: any[] = [];
    const options = {
        http: { keepAliveTimeout: 0 },
        general: { idleSocketsTimeout: 0, httpContextPoolSize: 1 },
        onEvent: (e: any) => events.push(e)
    } as any as WebServerOptions;

    const server = new TestServerBase(options);

    const customError = Object.assign(new Error('custom fail'), { code: 'UNKNOWN' });
    server.exposeOnSocketError(customError);

    context.assert.strictEqual(events.length, 1);
    context.assert.strictEqual(events[0].type, 'error');
    context.assert.strictEqual(events[0].detail, customError);

    events.length = 0;

    for (const code of ['ECONNRESET', 'EPIPE', 'ECONNABORTED']) {
        const err = Object.assign(new Error(code), { code });
        server.exposeOnSocketError(err);
    }

    context.assert.strictEqual(events.length, 0);
});

test('ServerBase: handleSocket overflow headers writes error and ends connection', async (context: TestContext) => {
    const events: any[] = [];
    const options = { http: { keepAliveTimeout: 0 }, general: { maximumHeaderSize: 1, idleSocketsTimeout: 0, httpContextPoolSize: 1 }, onEvent: (e: any) => events.push(e) } as any;
    const server = new TestServerBase(options);
    const socket = new PassThrough();
    server.exposeHandle(socket);

    socket.emit('data', Buffer.from('EXCEED'));

    context.assert.ok(server.writes.length > 0);
    context.assert.ok(events.some(e => e.type === 'error' && /431/.test(e.detail)));
    context.assert.strictEqual(server.ends.length, 1);
});

test('ServerBase: handleSocket parses header and body streams and closes if necessary', async (context: TestContext) => {
    const events: any[] = [];
    let receivedBody = Buffer.alloc(0);
    const options = { http: { keepAliveTimeout: 0 }, general: { maximumHeaderSize: 1024, idleSocketsTimeout: 0, httpContextPoolSize: 1 }, onEvent: (e: any) => events.push(e) } as any;
    const server = new TestServerBase(options);
    const socket = new PassThrough();
    server.exposeHandle(socket);

    const header = 'POST /test HTTP/1.1\r\nContent-Length: 4\r\n\r\n';
    const data = Buffer.concat([Buffer.from(header), Buffer.from('BODY')]);

    const ends: any[] = [];
    socket.end = () => (ends as any).push(true);

    socket.emit('data', data);
    await new Promise(r => setImmediate(r));

    context.assert.strictEqual(ends.length, 0);
});
