/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Application } from "@contextjs/system";
import { test, TestContext } from 'node:test';
import { MiddlewareExistsException } from "../../src/exceptions/middleware-exists.exception.ts";
import '../../src/extensions/application-extensions.ts';
import { IMiddleware } from "../../src/interfaces/i-middleware.ts";
import { IHttpContext } from "../../src/interfaces/i-http-context.ts";

test('useWebServer', (context: TestContext) => {
    const app = new Application();
    app.useWebServer(() => { });

    context.assert.notStrictEqual(app.webserver, null);
});

test('useWebServer_Success', (context: TestContext) => {
    const app = new Application();

    app.useWebServer(options => {
        options.http.enabled = true;
        options.http.port = 8080;
    });

    context.assert.notStrictEqual(app.webserver, null);
});

test('useMiddleware_Success', (context: TestContext) => {
    const app = new Application();
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

    app.useWebServer(options => {
        options.http.enabled = true;
        options.http.port = 8080;
        options.useMiddleware(new Middleware());
    });

    context.assert.notStrictEqual(app.webserver, null);
});

test('useMiddleware_AlreadyExists', (context: TestContext) => {
    const app = new Application();
    class Middleware implements IMiddleware {
        name: string = "Middleware";
        version: string;

        onRequestAsync(httpContext: IHttpContext, next: () => Promise<void>): Promise<void> {
            throw new Error("Method not implemented.");
        }

        onErrorAsync?(exception: any): Promise<void> {
            throw new Error("Method not implemented.");
        }
    }

    context.assert.throws(() => app.useWebServer(options => {
        options.http.enabled = true;
        options.http.port = 8080;
        options.useMiddleware(new Middleware());
        options.useMiddleware(new Middleware());
    }), MiddlewareExistsException);
});