/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { WebServerOptions } from '../../src/extensions/webserver-options.js';
import { IHttpContext } from '../../src/interfaces/i-http-context.js';
import { IMiddleware } from '../../src/interfaces/i-middleware.js';

test('WebServerOptions: default values', async (context: TestContext) => {
    const options = new WebServerOptions();

    context.assert.strictEqual(options.http.enabled, true);
    context.assert.strictEqual(options.http.port, 5000);
    context.assert.strictEqual(options.https.enabled, false);
    context.assert.strictEqual(options.https.port, undefined);
    context.assert.strictEqual(options.https.certificate, undefined);
});

test('WebServerOptions: useMiddleware() calls webServer.useMiddleware()', async (context: TestContext) => {
    class Middleware implements IMiddleware {
        name: string;
        version: string;

        onRequestAsync(httpContext: IHttpContext, next: () => Promise<void>): Promise<void> {
            throw new Error("Method not implemented.");
        }

        onErrorAsync?(exception: any): Promise<void> {
            throw new Error("Method not implemented.");
        }
    }
    const mockMiddleware = new Middleware();
    const mockWebServer = {
        useMiddlewareCalled: false,
        useMiddleware(middleware: unknown) {
            this.useMiddlewareCalled = true;
            context.assert.strictEqual(middleware, middleware);
        }
    };

    const options = new WebServerOptions();
    options.webServer = mockWebServer as any;

    const returned = options.useMiddleware(mockMiddleware);

    context.assert.strictEqual(mockWebServer.useMiddlewareCalled, true);
    context.assert.strictEqual(returned, options);
});