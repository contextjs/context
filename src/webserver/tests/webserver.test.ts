/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { test, TestContext } from 'node:test';
import { WebServerOptions } from '../src/extensions/webserver-options.js';
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