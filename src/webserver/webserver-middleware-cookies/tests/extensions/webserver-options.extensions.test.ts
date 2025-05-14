/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { MiddlewareExistsException, WebServerOptions } from '@contextjs/webserver';
import test, { TestContext } from 'node:test';
import { CookieMiddleware } from '../../src/cookie.middleware.js';
import "../../src/extensions/webserver-options.extensions.js";
import { Application } from '@contextjs/system';


test('WebServerOptions: useCookies registers CookieMiddleware and is chainable', (context: TestContext) => {
    const opts = new WebServerOptions();
    const registered: unknown[] = [];

    const original = WebServerOptions.prototype.useMiddleware;
    WebServerOptions.prototype.useMiddleware = function (middleware) {
        registered.push(middleware);
        return this;
    };

    try {
        const result = opts.useCookies();

        context.assert.strictEqual(result, opts);
        context.assert.equal(registered.length, 1);
        context.assert.ok(registered[0] instanceof CookieMiddleware);
    }
    finally {
        WebServerOptions.prototype.useMiddleware = original;
    }
});

test('WebServerOptions: Application.runAsync throws on duplicate cookie middleware', async (context: TestContext) => {
    const app = new Application();
    app.useWebServer(opts => {
        opts.useCookies();
        opts.useCookies();
    });

    await context.assert.rejects(() => app.runAsync(), MiddlewareExistsException);
});