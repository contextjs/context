/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { WebServerOptions } from '../src/options/webserver-options.js';
import type { IMiddleware } from '../src/interfaces/i-middleware.js';
import { WebServer } from '../src/webserver.js';

class FakeServer {
    public started = false;
    public stopped = false;
    public restarted = false;
    public middleware: IMiddleware[] = [];

    constructor(_opts: WebServerOptions) { }

    useMiddleware(mw: IMiddleware) {
        this.middleware.push(mw);
        return this;
    }

    async startAsync(): Promise<void> {
        this.started = true;
    }

    async stopAsync(): Promise<void> {
        this.stopped = true;
    }

    async restartAsync(): Promise<void> {
        this.restarted = true;
    }
}

test('WebServer: start/stop/restart only http when https disabled', async (context: TestContext) => {
    const options = new WebServerOptions();
    const server = new WebServer(options);
    (server as any).httpServer = new FakeServer(options);
    (server as any).httpsServer = undefined;

    await server.startAsync();
    context.assert.ok((server as any).httpServer.started, 'httpServer should have started');
    context.assert.strictEqual((server as any).httpsServer, undefined, 'httpsServer should be disabled');

    await server.stopAsync();
    context.assert.ok((server as any).httpServer.stopped, 'httpServer should have stopped');

    await server.restartAsync();
    context.assert.ok((server as any).httpServer.restarted, 'httpServer should have restarted');
});

test('WebServer: delegates useMiddleware to both servers', (context: TestContext) => {
    const options = new WebServerOptions();
    const server = new WebServer(options);

    const fakeHttp = new FakeServer(options);
    const fakeHttps = new FakeServer(options);
    (server as any).httpServer = fakeHttp;
    (server as any).httpsServer = fakeHttps;

    const middleware: IMiddleware = { name: 'm1', onRequest: () => { } };
    server.useMiddleware(middleware);

    context.assert.strictEqual(fakeHttp.middleware.includes(middleware), true, 'httpServer should receive middleware');
    context.assert.strictEqual(fakeHttps.middleware.includes(middleware), true, 'httpsServer should receive middleware');
});

test('WebServer: dispose removes signal handlers safely', (context: TestContext) => {
    const options = new WebServerOptions();
    const server = new WebServer(options);

    context.assert.doesNotThrow(() => { server.dispose(); server.dispose(); });
});