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

test('HttpContext.initialize: calls Request.initialize and Response.initialize, returns this', (context: TestContext) => {
    const ctx = new HttpContext();

    let reqCalled = false;
    let reqArgs: unknown[] = [];
    const origReqInit = Request.prototype.initialize;
    Request.prototype.initialize = function (method: string, path: string, headers: HeaderCollection, body: Readable) {
        reqCalled = true;
        reqArgs = [method, path, headers, body];
        return this;
    };

    let resCalled = false;
    let resArg: unknown;
    const origResInit = Response.prototype.initialize;
    Response.prototype.initialize = function (target: Socket) {
        resCalled = true;
        resArg = target;
        return this;
    };

    try {
        const headers = new HeaderCollection();
        const dummyTarget = {} as Socket;
        const dummyBody = new Readable({ read() { /* no-op */ } });

        const result = ctx.initialize('GET', '/test', headers, dummyTarget, dummyBody);
        context.assert.strictEqual(result, ctx);
        context.assert.ok(reqCalled);
        context.assert.deepStrictEqual(reqArgs, ['GET', '/test', headers, dummyBody]);
        context.assert.ok(resCalled);
        context.assert.strictEqual(resArg, dummyTarget);
    }
    finally {
        Request.prototype.initialize = origReqInit;
        Response.prototype.initialize = origResInit;
    }
});

test('HttpContext.reset: calls Request.reset and Response.reset, returns this', (context: TestContext) => {
    const ctx = new HttpContext();

    let reqReset = false;
    const origReqReset = Request.prototype.reset;
    Request.prototype.reset = function () {
        reqReset = true;
        return this;
    };

    let resReset = false;
    const origResReset = Response.prototype.reset;
    Response.prototype.reset = function () { resReset = true; return this; };

    try {
        const result = ctx.reset();
        context.assert.strictEqual(result, ctx);
        context.assert.ok(reqReset);
        context.assert.ok(resReset);
    }
    finally {
        Request.prototype.reset = origReqReset;
        Response.prototype.reset = origResReset;
    }
});