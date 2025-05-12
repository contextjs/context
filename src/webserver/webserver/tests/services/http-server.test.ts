/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { EventEmitter } from 'node:events';
import { Socket } from 'node:net';
import { PassThrough } from 'node:stream';
import test, { TestContext } from 'node:test';
import { WebServerEvent } from '../../src/models/webserver-event.js';
import type { WebServerOptions } from '../../src/options/webserver-options.js';
import { HttpServer } from '../../src/services/http-server.js';

class FakeServer extends EventEmitter {
    public listening = false;
    address() { return { port: 0, family: 'IPv4', address: '127.0.0.1' }; }

    listen(...args: any[]): this {
        process.nextTick(() => {
            this.listening = true;
            this.emit('listening');
            const lastArg = args[args.length - 1];
            if (typeof lastArg === 'function')
                lastArg();
        });
        return this;
    }

    close(callback?: (err?: Error) => void): this {
        process.nextTick(() => { this.emit('close'); callback?.(); });
        return this;
    }

    ref(): this { return this; }
    unref(): this { return this; }
    get maxConnections() { return 0; }
    set maxConnections(n: number) { }
    get connections() { return 0; }

    addListener = this.on.bind(this);
    off = this.removeListener.bind(this);
}

class ThrowingServer extends EventEmitter {
    listen(): this {
        throw new Error('fail');
    }
    close(): this { return this; }
    ref(): this { return this; }
    unref(): this { return this; }
    address() { return { port: 0, family: 'IPv4', address: '127.0.0.1' }; }
    get maxConnections() { return 0; }
    set maxConnections(n: number) { }
    get connections() { return 0; }
}

class TestHttpServer extends HttpServer {
    constructor(options: WebServerOptions) {
        super(options);
        (this as any).server = new FakeServer();
        (this as any).server.on('error', () => { });
        (this as any).configure();
    }
    public getTrackedSockets(): Map<Socket, { lastActive: number }> {
        return (this as any).sockets;
    }
}

const defaultOptions: WebServerOptions = {
    http: { port: 1234, host: '127.0.0.1', keepAliveTimeout: 10 },
    general: { maximumHeaderSize: 1024, httpContextPoolSize: 2, idleSocketsTimeout: 5 },
    onEvent: () => { }
} as any;

test('HttpServer: startAsync succeeds and logs listening', async (context: TestContext) => {
    const events: any[] = [];
    const options: WebServerOptions = { ...defaultOptions, onEvent: e => events.push(e) } as any;
    const server = new TestHttpServer(options);

    await server.startAsync();
    context.assert.ok((server as any).server.listening);
    context.assert.ok(events.some(e => e.type === 'info' && e.detail.includes('Starting')));

    await server.stopAsync();
});

test('HttpServer: startAsync throws when listen() throws', async (context: TestContext) => {
    const events: any[] = [];
    const options: WebServerOptions = { ...defaultOptions, onEvent: e => events.push(e) } as any;

    class ErrorHttpServer extends TestHttpServer {
        constructor(opts: WebServerOptions) {
            super(opts);
            (this as any).server = new ThrowingServer();
            (this as any).configure();
        }
    }

    const server = new ErrorHttpServer(options);

    await context.assert.rejects(() => server.startAsync(), { message: 'fail' });
    context.assert.strictEqual(events.length, 0);
});

test('HttpServer: stopAsync with no sockets logs immediate shutdown', async (context: TestContext) => {
    const events: any[] = [];
    const options: WebServerOptions = { ...defaultOptions, onEvent: e => events.push(e) } as any;
    const server = new TestHttpServer(options);

    await server.stopAsync();

    context.assert.ok(events.some(e => e.detail.includes('No active connections')));
});

test('HttpServer: stopAsync destroys sockets on timeout', async (context: TestContext) => {
    const events: any[] = [];
    const options: WebServerOptions = { ...defaultOptions, onEvent: e => events.push(e) } as any;
    const server = new TestHttpServer(options);

    const fakeSocket = new EventEmitter() as Socket;
    let wasDestroyed = false;
    (fakeSocket as any).destroy = () => { wasDestroyed = true; };
    server.getTrackedSockets().set(fakeSocket, { lastActive: Date.now() });

    await server.stopAsync();

    context.assert.ok(events.some(e => e.type === 'warning'));
    context.assert.ok(wasDestroyed);
});

test('HttpServer: configure tracks and cleans up connections and removes old listeners', (context: TestContext) => {
    const handled: Socket[] = [];
    class ConfigHttpServer extends TestHttpServer {
        override handleSocket(socket: Socket) { handled.push(socket); }
    }
    const server = new ConfigHttpServer(defaultOptions) as any;
    const fakeServer = (server as any).server as FakeServer;

    const dummy = () => { };
    fakeServer.on('connection', dummy);
    (server as any).configure();

    context.assert.ok(!fakeServer.listeners('connection').includes(dummy));

    const fakeSocket = new PassThrough() as any as Socket;
    fakeServer.emit('connection', fakeSocket);

    context.assert.ok(server.getTrackedSockets().has(fakeSocket));
    context.assert.strictEqual(handled[0], fakeSocket);

    fakeSocket.emit('close');
    context.assert.ok(!server.getTrackedSockets().has(fakeSocket));
});