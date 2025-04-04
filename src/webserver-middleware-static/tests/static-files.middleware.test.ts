/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { File } from '@contextjs/io';
import { IHttpContext, IHttpRequest, IHttpResponse } from '@contextjs/webserver';
import { test, TestContext } from 'node:test';
import { StaticFilesMiddleware } from '../src/static-files.middleware';

test('StaticFilesMiddleware: onRequestAsync - success', async (context: TestContext) => {
    const staticFilesMiddleware = new StaticFilesMiddleware();
    const httpRequest: IHttpRequest = { url: '/index.html', httpVersion: '1.1', httpMethod: 'GET', headers: [], host: 'localhost', statusCode: 200, statusMessage: 'OK' };
    const httpResponse: IHttpResponse = { statusCode: 200, write: () => { }, streamAsync: async () => { }, setHeader: () => { } };
    const httpContext: IHttpContext = { request: httpRequest, response: httpResponse };

    context.mock.method(File, 'exists', () => true);

    context.assert.doesNotThrow(async () => await staticFilesMiddleware.onRequestAsync(httpContext, async () => { }));
    context.assert.strictEqual(staticFilesMiddleware.name, 'StaticFilesMiddleware');
    context.assert.strictEqual(staticFilesMiddleware.version, '1.0.0');
    context.assert.strictEqual(staticFilesMiddleware.publicFolder, 'public');
});