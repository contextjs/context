/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Socket } from 'net';
import test, { TestContext } from 'node:test';
import { Readable } from 'stream';
import { HeaderCollection } from '../../src/models/header.collection.js';
import { HttpContext } from '../../src/models/http-context.js';
import { Request } from '../../src/models/request.js';
import { Response } from '../../src/models/response.js';

test('HttpContext: initialize delegates to Request.initialize and Response.initialize, returns this', (context: TestContext) => {
    const httpContext = new HttpContext();

    let requestCalled = false;
    let requestArguments: unknown[] = [];
    const originalRequestInitializer = Request.prototype.initialize;
    Request.prototype.initialize = function (
        method: unknown,
        path: unknown,
        headers: unknown,
        body: unknown,
        protocol: unknown,
        host: unknown,
        port: unknown) {
        requestCalled = true;
        requestArguments = [method, path, headers, body, protocol, host, port];
        return this;
    };

    let responseCalled = false;
    let responseArgument: unknown;
    const originalResponseInitializer = Response.prototype.initialize;
    Response.prototype.initialize = function (target: unknown) {
        responseCalled = true;
        responseArgument = target;
        return this;
    };

    try {
        const headers = new HeaderCollection();
        const testTarget = {} as Socket;
        const testBody = new Readable({ read() { } });

        const result = httpContext.initialize('HTTPS', 'example.com', 8443, 'GET', '/test', headers, testTarget, testBody);

        context.assert.strictEqual(result, httpContext);
        context.assert.ok(requestCalled, 'Request.initialize should have been called');
        context.assert.deepStrictEqual(requestArguments, ['HTTPS', 'example.com', 8443, 'GET', '/test', headers, testBody]);
        context.assert.ok(responseCalled, 'Response.initialize should have been called');
        context.assert.strictEqual(responseArgument, testTarget);
    }
    finally {
        Request.prototype.initialize = originalRequestInitializer;
        Response.prototype.initialize = originalResponseInitializer;
    }
});

test('HttpContext: reset: delegates to Request.reset and Response.reset, returns this', (context: TestContext) => {
    const httpContext = new HttpContext();
    let requestReset = false;
    const originalRequestReset = Request.prototype.reset;
    Request.prototype.reset = function () { requestReset = true; return this; };

    let responseReset = false;
    const originalResponseReset = Response.prototype.reset;
    Response.prototype.reset = function () { responseReset = true; return this; };

    try {
        const result = httpContext.reset();

        context.assert.strictEqual(result, httpContext);
        context.assert.ok(requestReset, 'Request.reset should have been called');
        context.assert.ok(responseReset, 'Response.reset should have been called');
    }
    finally {
        Request.prototype.reset = originalRequestReset;
        Response.prototype.reset = originalResponseReset;
    }
});
