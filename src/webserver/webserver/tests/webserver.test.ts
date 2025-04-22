/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { test, TestContext } from 'node:test';
import { WebServerOptions } from '../src/extensions/webserver-options.js';
import { HttpContext } from '../src/http-context.js';
import { HttpRequest } from '../src/http-request.js';
import { HttpResponse } from '../src/http-response.js';
import { WebServer } from '../src/webserver.js';

test('startAsync_Success', async (context: TestContext) => {

    const webserverOptions = new WebServerOptions();
    webserverOptions.http.enabled = true;
    webserverOptions.http.port = 8880;
    const webServer = new WebServer(webserverOptions);

    await webServer.startAsync();

    context.assert.notStrictEqual(webServer, null);
    context.assert.strictEqual(webServer.listeningOnHttp(), true);

    await webServer.stopAsync();
});

test('stopAsync_Success', async (context: TestContext) => {

    const webserverOptions = new WebServerOptions();
    webserverOptions.http.enabled = true;
    webserverOptions.http.port = 8880;
    const webServer = new WebServer(webserverOptions);

    await webServer.startAsync();
    await webServer.stopAsync();

    context.assert.notStrictEqual(webServer, null);
    context.assert.strictEqual(webServer.listeningOnHttp(), false);
});

test('restartAsync_Success', async (context: TestContext) => {

    const webserverOptions = new WebServerOptions();
    webserverOptions.http.enabled = true;
    webserverOptions.http.port = 8880;
    const webServer = new WebServer(webserverOptions);

    await webServer.startAsync();
    await webServer.restartAsync();

    context.assert.notStrictEqual(webServer, null);
    context.assert.strictEqual(webServer.listeningOnHttp(), true);

    await webServer.stopAsync();
});

test('listeningOnHttp_Success', async (context: TestContext) => {

    const webserverOptions = new WebServerOptions();
    webserverOptions.http.enabled = true;
    webserverOptions.http.port = 8880;
    const webServer = new WebServer(webserverOptions);

    await webServer.startAsync();
    context.assert.strictEqual(webServer.listeningOnHttp(), true);

    await webServer.stopAsync();
});

test('listeningOnHttps_Failure', async (context: TestContext) => {

    const webserverOptions = new WebServerOptions();
    webserverOptions.http.enabled = true;
    webserverOptions.http.port = 8880;
    const webServer = new WebServer(webserverOptions);

    await webServer.startAsync();
    context.assert.strictEqual(webServer.listeningOnHttps(), false);

    await webServer.stopAsync();
});

test('parseRequestAsync_Success', async (context: TestContext) => {

    const webserverOptions = new WebServerOptions();
    webserverOptions.http.enabled = true;
    webserverOptions.http.port = 8880;
    const webServer = new WebServer(webserverOptions);

    await webServer.startAsync();

    context.assert.strictEqual(webServer.listeningOnHttps(), false);
    context.assert.doesNotThrow(async () => await (webServer as any).parseRequestAsync());

    await webServer.stopAsync();
});

test('WebServer: handleTimeoutAsync - success', async (context: TestContext) => {
    const webServer = new WebServer(new WebServerOptions());
    let timeoutCalled = false;

    webServer.onTimeoutAsync = async () => { timeoutCalled = true; };

    const mockSocket = { destroy: context.mock.fn() } as any;
    await (webServer as any).handleTimeoutAsync(mockSocket);

    context.assert.strictEqual(timeoutCalled, true);
    context.assert.strictEqual(mockSocket.destroy.mock.callCount(), 1);
});

test('WebServer: parseExceptionAsync - onErrorAsync triggered', async (context: TestContext) => {
    const webServer = new WebServer(new WebServerOptions());
    let errorHandled = false;

    webServer.onErrorAsync = async () => { errorHandled = true; };
    await (webServer as any).parseExceptionAsync(new Error('test'));

    context.assert.strictEqual(errorHandled, true);
});

test('WebServer: disposeAsync - no servers listening', async (context: TestContext) => {
    const webServer = new WebServer(new WebServerOptions());
    await webServer.disposeAsync();
    context.assert.ok(true);
});

test('WebServer: useMiddleware - duplicate throws', (context: TestContext) => {
    const webServer = new WebServer(new WebServerOptions());
    const middleware = { name: "test", version: "1.0", onRequestAsync: async () => { } };

    webServer.useMiddleware(middleware);
    context.assert.throws(() => webServer.useMiddleware(middleware));
});

test('WebServer: attachGracefulShutdownIfNeeded - idempotent', async (context: TestContext) => {
    const webServer = new WebServer(new WebServerOptions());
    (webServer as any).attachGracefulShutdownIfNeeded();
    (webServer as any).attachGracefulShutdownIfNeeded();

    context.assert.ok(true);
});

test('WebServer: isRunning - returns correct state', async (context: TestContext) => {
    const options = new WebServerOptions();
    options.http.port = 8880;
    const webServer = new WebServer(options);

    context.assert.strictEqual(webServer.isRunning(), false);
    await webServer.startAsync();
    context.assert.strictEqual(webServer.isRunning(), true);
    await webServer.stopAsync();
});

test('WebServer: attachGracefulShutdownIfNeeded - skips if already attached', (context: TestContext) => {
    const webServer = new WebServer(new WebServerOptions());
    (webServer as any).gracefulShutdownAttached = true;

    (webServer as any).attachGracefulShutdownIfNeeded(); // should noop

    context.assert.ok(true);
});

test('WebServer: parseRequestAsync - middleware and finalize response', async (context: TestContext) => {
    let middlewareCalled = false;

    const options = new WebServerOptions();
    const webServer = new WebServer(options);

    webServer.useMiddleware({
        name: 'TestMiddleware',
        version: '1.0',
        onRequestAsync: async (_httpContext, next) => {
            middlewareCalled = true;
            await next();
        }
    });

    const fakeResponse = {
        writableEnded: false,
        setHeader: context.mock.fn(),
        end: context.mock.fn()
    };

    const fakeRequest = {
        headers: { host: 'localhost' },
        httpVersion: '1.1',
        method: 'GET',
        url: '/',
        statusCode: 200,
        statusMessage: 'OK'
    };

    await (webServer as any).parseRequestAsync(fakeRequest, fakeResponse);

    context.assert.strictEqual(middlewareCalled, true);
    context.assert.strictEqual(fakeResponse.setHeader.mock.callCount(), 1);
    context.assert.strictEqual(fakeResponse.end.mock.callCount(), 1);
});

test('WebServer: finalizeResponse - writableEnded skips end', (context: TestContext) => {
    const options = new WebServerOptions();
    const webServer = new WebServer(options);

    const serverResponse = {
        writableEnded: true,
        setHeader: context.mock.fn(),
        end: context.mock.fn()
    };

    const httpRequest = {} as HttpRequest;
    const httpResponse = new HttpResponse(serverResponse as any);

    const httpContext = new HttpContext(httpRequest, httpResponse);
    (webServer as any).finalizeResponse(httpContext);

    context.assert.strictEqual(serverResponse.setHeader.mock.callCount(), 0);
    context.assert.strictEqual(serverResponse.end.mock.callCount(), 0);
});

test("WebServer: attachGracefulShutdownIfNeeded - shutdown handler triggers", async (context: TestContext) => {
    const options = new WebServerOptions();
    const webServer = new WebServer(options);

    let disposed = false;
    let exited = false;

    const originalExit = process.exit;
    process.exit = ((code?: number) => { exited = true; return undefined as never; }) as NodeJS.Process["exit"];
    context.mock.method(webServer, "disposeAsync", async () => { disposed = true; });


    try {
        (webServer as any).attachGracefulShutdownIfNeeded();
        process.emit("SIGINT");

        await new Promise(resolve => setTimeout(resolve, 10));

        context.assert.strictEqual(disposed, true);
        context.assert.strictEqual(exited, true);
    }
    finally {
        process.exit = originalExit;
    }
});