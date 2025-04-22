/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { File } from '@contextjs/io';
import { IHttpContext, IHttpRequest, IHttpResponse } from '@contextjs/webserver';
import path from 'node:path';
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

test("StaticFilesMiddleware: onRequestAsync - file exists and extension matches", async (context: TestContext) => {
    const middleware = new StaticFilesMiddleware();
    middleware.fileExtensions = ["html"];
    middleware.publicFolder = "static";

    const httpRequest: IHttpRequest = {
        url: "/index.html",
        httpVersion: "1.1",
        httpMethod: "GET",
        headers: [],
        host: "localhost",
        statusCode: 200,
        statusMessage: "OK"
    };

    let setContentType: string | undefined;
    let streamedFilePath: string | undefined;

    const httpResponse: IHttpResponse = {
        statusCode: 200,
        write: () => { },
        setHeader: (name: string, value: string) => {
            if (name === "Content-Type")
                setContentType = value;
        },
        streamAsync: async (filePath: string) => {
            streamedFilePath = filePath;
        }
    };

    const httpContext: IHttpContext = {
        request: httpRequest,
        response: httpResponse
    };

    context.mock.method(File, "exists", () => true);

    await middleware.onRequestAsync(httpContext, async () => {
        throw new Error("next() should not be called");
    });

    context.assert.strictEqual(streamedFilePath, path.join("static", "index.html"));
    context.assert.strictEqual(setContentType, "text/html");
});