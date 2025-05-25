/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { strict as assert } from 'node:assert';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test, { TestContext } from 'node:test';
import { promisify } from 'node:util';
import { StaticFilesMiddleware } from '../src/static-files.middleware.js';

const mkdtemp = promisify(fs.mkdtemp);

function createContext(requestPath) {
    let sentData = '';
    let endCallback: any;
    const streamPromise = new Promise(resolve => { endCallback = resolve; });
    const headers = {};
    const httpContext = {
        request: { path: requestPath },
        response: {
            statusCode: 200,
            headers,
            body: "",
            setHeader(name: any, value: any) {
                headers[name] = value;
                return this;
            },
            sendAsync(body: any) {
                this.body = body;
            },
            streamAsync(readable: any) {
                readable.on('data', (chunk: any) => sentData += chunk.toString());
                readable.on('end', () => {
                    httpContext._streamResult = sentData;
                    endCallback();
                });
            },
            setStatus(code: number, message: string) {
                this.statusCode = code;
                this.statusMessage = message;
            }
        },
        _streamResult: "",
        _streamPromise: streamPromise
    };
    return httpContext;
}

test('StaticFilesMiddleware: onRequest: invalid (null or whitespace) URL returns 500 error', async (t: TestContext) => {
    const staticFilesMiddleware = new StaticFilesMiddleware();
    const httpContext1 = createContext('');
    await staticFilesMiddleware.onRequest(httpContext1 as any, () => { throw new Error('next should not be called'); });
    const httpContext2 = createContext('   ');
    await staticFilesMiddleware.onRequest(httpContext2 as any, () => { throw new Error('next should not be called'); });

    assert.strictEqual(httpContext1.response.statusCode, 500);
    assert.ok(httpContext1.response.body.includes('Server Error'));
    assert.strictEqual(httpContext2.response.statusCode, 500);
    assert.ok(httpContext2.response.body.includes('Server Error'));
});

test('StaticFilesMiddleware: onRequest: extension not in allowed list calls next()', async (t: TestContext) => {
    const staticFilesMiddleware = new StaticFilesMiddleware();
    staticFilesMiddleware.fileExtensions = ['html'];
    const httpContext = createContext('/file.txt');
    let nextCalled = false;
    await staticFilesMiddleware.onRequest(httpContext as any, async () => { nextCalled = true; });

    assert.ok(nextCalled, 'next() should have been called');
});

test('StaticFilesMiddleware:onRequest: no extension configured (empty list) calls next()', async (t: TestContext) => {
    const staticFilesMiddleware = new StaticFilesMiddleware();
    const httpContext = createContext('/file.any');
    let nextCalled = false;
    await staticFilesMiddleware.onRequest(httpContext as any, async () => { nextCalled = true; });

    assert.ok(nextCalled);
});

test('StaticFilesMiddleware:onRequest: file does not exist calls next()', async (t: TestContext) => {
    const staticFilesMiddleware = new StaticFilesMiddleware();
    staticFilesMiddleware.publicFolder = '/nonexistent';
    staticFilesMiddleware.fileExtensions = ['txt'];
    const httpContext = createContext('/nofile.txt');
    let nextCalled = false;
    await staticFilesMiddleware.onRequest(httpContext as any, async () => { nextCalled = true; });

    assert.ok(nextCalled);
});

test('StaticFilesMiddleware: onRequest: serves existing file with correct headers and content', async (t: TestContext) => {
    const tmpDir = await mkdtemp(path.join(os.tmpdir(), 'static-test-'));
    const filename = 'test.txt';
    const content = 'Hello, ContextJS!';
    const filePath = path.join(tmpDir, filename);
    await fs.promises.writeFile(filePath, content);

    const staticFilesMiddleware = new StaticFilesMiddleware();
    staticFilesMiddleware.publicFolder = tmpDir;
    staticFilesMiddleware.fileExtensions = ['txt'];

    const httpContext = createContext(filename);
    await staticFilesMiddleware.onRequest(httpContext as any, async () => { throw new Error('next should not be called'); });

    await httpContext._streamPromise;

    assert.strictEqual(httpContext.response.headers['Content-Type'], 'text/plain');
    assert.strictEqual(+httpContext.response.headers['Content-Length'], content.length);
    assert.strictEqual(httpContext._streamResult, content);

    await fs.promises.unlink(filePath);
    await fs.promises.rmdir(tmpDir);
});