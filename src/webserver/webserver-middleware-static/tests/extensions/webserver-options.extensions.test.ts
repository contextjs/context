/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import "@contextjs/webserver";
import { IMiddleware, WebServerOptions } from '@contextjs/webserver';
import test, { TestContext } from 'node:test';
import { StaticFilesOptions } from '../../src/extensions/static-files.options.js';
import "../../src/extensions/webserver-options.extensions.js";
import { StaticFilesMiddleware } from '../../src/static-files.middleware.js';

function createOptionsWithApplied(): { options: WebServerOptions; applied: IMiddleware[] } {
    const applied: IMiddleware[] = [];
    const fakeServer = { useMiddleware: (middleware: IMiddleware) => applied.push(middleware) };
    const options = new WebServerOptions();
    // @ts-ignore
    options.webServer = fakeServer;
    return { options, applied };
}

test('WebServerOptions: useStaticFiles registers middleware with custom settings', async (context: TestContext) => {
    const { options, applied } = createOptionsWithApplied();
    const webServerOptions = options.useStaticFiles((options: StaticFilesOptions) => {
        options.publicFolder = 'assets';
        options.fileExtensions = ['html', 'css', 'js'];
    });
    const middleware = applied[0];

    context.assert.strictEqual(webServerOptions, options);
    context.assert.strictEqual(applied.length, 1);
    context.assert.ok(middleware instanceof StaticFilesMiddleware);
    context.assert.strictEqual(middleware.publicFolder, 'assets');
    context.assert.deepStrictEqual(middleware.fileExtensions, ['html', 'css', 'js']);
});

test('WebServerOptions: useStaticFiles uses defaults when no callback is provided', async (context: TestContext) => {
    const { options, applied } = createOptionsWithApplied();
    // @ts-ignore
    const webServerOptions = options.useStaticFiles();
    const middleware = applied[0] as StaticFilesMiddleware;

    context.assert.strictEqual(webServerOptions, options);
    context.assert.strictEqual(applied.length, 1);
    context.assert.strictEqual(middleware.publicFolder, 'public');
    context.assert.deepStrictEqual(middleware.fileExtensions, []);
});

test('WebServerOptions: useStaticFiles treats null callback as no-op and uses defaults', async (context: TestContext) => {
    const { options, applied } = createOptionsWithApplied();
    // @ts-ignore
    const webServerOptions = options.useStaticFiles(null);
    const middleware = applied[0] as StaticFilesMiddleware;

    context.assert.strictEqual(webServerOptions, options);
    context.assert.strictEqual(applied.length, 1);
    context.assert.strictEqual(middleware.publicFolder, 'public');
    context.assert.deepStrictEqual(middleware.fileExtensions, []);
});

test('WebServerOptions: useStaticFiles allows partial configuration of StaticFilesOptions', async (context: TestContext) => {
    const { options, applied } = createOptionsWithApplied();
    options.useStaticFiles((options: StaticFilesOptions) => options.fileExtensions = ['txt']);
    const middleware = applied[0] as StaticFilesMiddleware;

    context.assert.strictEqual(applied.length, 1);
    context.assert.strictEqual(middleware.publicFolder, 'public');
    context.assert.deepStrictEqual(middleware.fileExtensions, ['txt']);
});