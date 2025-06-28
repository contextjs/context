/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import type { IMiddleware } from '../src/interfaces/i-middleware.js';
import { WebServerOptions } from '../src/options/webserver-options.js';
import { HttpServer } from '../src/services/http-server.js';
import { HttpsServer } from '../src/services/https-server.js';
import { WebServer } from '../src/webserver.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const KEY_PATH = resolve(__dirname, './fixtures/test-key.pem');
const CERT_PATH = resolve(__dirname, './fixtures/test-cert.pem');

function stubHttpsConstructor() {
    (HttpsServer.prototype as any).useMiddleware = function (mw: IMiddleware) {
        (this as any)._applied = ((this as any)._applied || []).concat(mw);
        return this;
    };
    (HttpsServer.prototype as any).startAsync = async function () {
        (this as any).started = true;
    };
}

function stubHttpConstructor() {
    (HttpServer.prototype as any).useMiddleware = function (mw: IMiddleware) {
        (this as any)._applied = ((this as any)._applied || []).concat(mw);
        return this;
    };
    (HttpServer.prototype as any).startAsync = async function () {
        (this as any).started = true;
    };
}

test('WebServer: startAsync twice throws', async (t: TestContext) => {
    const origHttpStart = HttpServer.prototype.startAsync;
    const origHttpsStart = HttpsServer.prototype.startAsync;
    HttpServer.prototype.startAsync = async function () { (this as any).started = true; };
    HttpsServer.prototype.startAsync = async function () { (this as any).started = true; };

    const server = new WebServer(new WebServerOptions());
    await server.startAsync();

    await t.assert.rejects(() => server.startAsync(), { message: /already started/ });

    HttpServer.prototype.startAsync = origHttpStart;
    HttpsServer.prototype.startAsync = origHttpsStart;

    await server.stopAsync();
});

test('WebServer: start/stop only HTTP when HTTPS disabled', async (context: TestContext) => {
    const origHttpStart = HttpServer.prototype.startAsync;
    const origHttpStop = HttpServer.prototype.stopAsync;
    HttpServer.prototype.startAsync = async function () { (this as any).started = true; };
    HttpServer.prototype.stopAsync = async function () { (this as any).stopped = true; };

    const server = new WebServer(new WebServerOptions());
    await server.startAsync();

    const httpSrv = (server as any).httpServer as HttpServer & { started?: boolean, stopped?: boolean };
    context.assert.ok(httpSrv?.started, 'httpServer should have started');
    context.assert.strictEqual((server as any).httpsServer, undefined, 'httpsServer must be undefined');

    await server.stopAsync();
    context.assert.ok(httpSrv?.stopped, 'httpServer should have stopped');

    HttpServer.prototype.startAsync = origHttpStart;
    HttpServer.prototype.stopAsync = origHttpStop;
});

test('WebServer: stopAsync clears server references', async (t: TestContext) => {
    const origHttpStart = HttpServer.prototype.startAsync;
    HttpServer.prototype.startAsync = async function () { };

    const server = new WebServer(new WebServerOptions());
    await server.startAsync();
    await server.stopAsync();

    t.assert.strictEqual((server as any).httpServer, undefined, 'httpServer should be undefined after stop');

    HttpServer.prototype.startAsync = origHttpStart;
});

test('WebServer: restartAsync re-creates and starts new servers', async (t: TestContext) => {
    const origHttpStart = HttpServer.prototype.startAsync;
    const origHttpStop = HttpServer.prototype.stopAsync;
    HttpServer.prototype.startAsync = async function () { (this as any).started = true; };
    HttpServer.prototype.stopAsync = async function () { (this as any).stopped = true; };

    const server = new WebServer(new WebServerOptions());
    await server.startAsync();
    const first = (server as any).httpServer;

    await server.restartAsync();
    const second = (server as any).httpServer;

    t.assert.notStrictEqual(second, first, 'restartAsync should allocate a fresh server');
    t.assert.ok((second as any).started, 'new server should have been started');

    await server.stopAsync();

    HttpServer.prototype.startAsync = origHttpStart;
    HttpServer.prototype.stopAsync = origHttpStop;
});

test('WebServer: delegates useMiddleware to both HTTP and HTTPS', async (t: TestContext) => {
    const opts = new WebServerOptions();
    opts.http.enabled = true;
    opts.https.enabled = true;
    opts.https.certificate = { cert: CERT_PATH, key: KEY_PATH };

    stubHttpConstructor();
    stubHttpsConstructor();

    const server = new WebServer(opts);
    const mw: IMiddleware = { name: 'm1', onRequest: () => { } };
    server.useMiddleware(mw);

    await server.startAsync();

    const httpSrv = (server as any).httpServer as any;
    const httpsSrv = (server as any).httpsServer as any;

    t.assert.ok(httpSrv._applied.includes(mw), 'middleware should be applied to HTTP');
    t.assert.ok(httpsSrv._applied.includes(mw), 'middleware should be applied to HTTPS');
});


test('WebServer: dispose removes signal handlers safely', (context: TestContext) => {
    const options = new WebServerOptions();
    const server = new WebServer(options);

    context.assert.doesNotThrow(() => { server.dispose(); server.dispose(); });
});

test('WebServer: setOptions sets options and applies middleware', async (context: TestContext) => {
    const opts = new WebServerOptions();
    opts.http.enabled = true;
    opts.https.enabled = true;
    opts.https.certificate = { cert: CERT_PATH, key: KEY_PATH };

    stubHttpConstructor();
    stubHttpsConstructor();

    const server = new WebServer(new WebServerOptions());
    server.setOptions(opts);

    const mw: IMiddleware = { name: 'm1', onRequest: () => { } };
    server.useMiddleware(mw);

    await server.startAsync();

    const httpSrv = (server as any).httpServer as any;
    const httpsSrv = (server as any).httpsServer as any;

    context.assert.ok(httpSrv._applied.includes(mw), 'middleware should be applied to HTTP');
    context.assert.ok(httpsSrv._applied.includes(mw), 'middleware should be applied to HTTPS');
});

test('WebServer: waitUntilListening calls subserver wait', async (context: TestContext) => {
    const webServer = new WebServer(new WebServerOptions());

    let httpWaited = false, httpsWaited = false;
    webServer['httpServer'] = { waitUntilListening: async () => { httpWaited = true; } } as any;
    webServer['httpsServer'] = { waitUntilListening: async () => { httpsWaited = true; } } as any;

    await context.assert.doesNotReject(() => webServer.waitUntilListening());
    context.assert.strictEqual(httpWaited, true);
    context.assert.strictEqual(httpsWaited, true);
});

test('WebServer: hasMiddleware checks middleware presence', (context: TestContext) => {
    const options = new WebServerOptions();
    const server = new WebServer(options);
    const mw1: IMiddleware = { name: 'm1', onRequest: () => { } };
    const mw2: IMiddleware = { name: 'm2', onRequest: () => { } };

    server.useMiddleware(mw1);
    context.assert.ok(server.hasMiddleware('m1'), 'should find m1 middleware');
    context.assert.ok(!server.hasMiddleware('m2'), 'should not find m2 middleware');

    server.useMiddleware(mw2);
    context.assert.ok(server.hasMiddleware('m2'), 'should find m2 middleware after adding it');
});