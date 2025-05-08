/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { WebServerOptions } from '../../src/options/webserver-options.js';
import { GeneralWebServerOptions } from '../../src/options/general-webserver-options.js';
import { HttpWebServerOptions } from '../../src/options/http-webserver-options.js';
import { HttpsWebServerOptions } from '../../src/options/https-webserver-options.js';
import { IMiddleware } from '../../src/interfaces/i-middleware.js';

test('WebServerOptions: default constructor initializes defaults', (context: TestContext) => {
    const opts = new WebServerOptions();

    context.assert.ok(opts.general instanceof GeneralWebServerOptions);
    context.assert.ok(opts.http instanceof HttpWebServerOptions);
    context.assert.ok(opts.https instanceof HttpsWebServerOptions);
    context.assert.strictEqual(typeof opts.onEvent, 'function');
});

test('WebServerOptions: constructor assigns provided instances and callback', (context: TestContext) => {
    const customGeneral = new GeneralWebServerOptions(2048);
    const customHttp = new HttpWebServerOptions(false, 'example.com', 8080, 12000);
    const customHttps = new HttpsWebServerOptions(true, 'secure.com', 8443, { cert: 'c', key: 'k' }, 15000);
    const events: any[] = [];
    const callback = (e: any) => events.push(e);

    const opts = new WebServerOptions(customGeneral, customHttp, customHttps, callback);

    context.assert.strictEqual(opts.general, customGeneral);
    context.assert.strictEqual(opts.http, customHttp);
    context.assert.strictEqual(opts.https, customHttps);
    context.assert.strictEqual(opts.onEvent, callback);
});

test('WebServerOptions: useMiddleware calls webServer.useMiddleware and returns self', (context: TestContext) => {
    const opts = new WebServerOptions();
    const dummyMiddleware: IMiddleware = { name: 'm1', onRequest: () => { } } as any;

    let calledWith: IMiddleware | null = null;
    opts.webServer = { useMiddleware: (mw: IMiddleware) => { calledWith = mw; } } as any;
    const ret = opts.useMiddleware(dummyMiddleware);
    
    context.assert.strictEqual(calledWith, dummyMiddleware);
    context.assert.strictEqual(ret, opts);
});
