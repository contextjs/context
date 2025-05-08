/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Application } from '@contextjs/system';
import test, { TestContext } from 'node:test';
import '../../src/extensions/application-extensions.js';
import { WebServer } from '../../src/webserver.js';

test('Application: useWebServer: throws when options callback is null or undefined', (context: TestContext) => {
    const application = new Application();

    context.assert.throws(() => (application as any).useWebServer(null), Error);
    context.assert.throws(() => (application as any).useWebServer(undefined), Error);
});

test('Application: useWebServer: returns the application instance and sets webserver property', (context: TestContext) => {
    const application = new Application();
    const returnedApplication = application.useWebServer(opts => { });

    context.assert.strictEqual(returnedApplication, application);
    context.assert.ok(application.webServer instanceof WebServer);
});

test('Application: useWebServer: invokes startAsync on runAsync', async (context: TestContext) => {
    const application = new Application();

    let started = false;
    const original = WebServer.prototype.startAsync;
    WebServer.prototype.startAsync = function (): Promise<void[]> {
        started = true; return Promise.resolve([]);
    };

    try {
        application.useWebServer(opts => { });
        await application.runAsync();

        context.assert.ok(started);
    }
    finally {
        WebServer.prototype.startAsync = original;
    }
});