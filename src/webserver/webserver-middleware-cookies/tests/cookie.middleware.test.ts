/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { CookieMiddleware } from '../src/cookie.middleware.js';
import { CookieCollection } from '../src/models/cookie.collection.js';
import { Cookie } from '../src/models/cookie.js';

function createFakeContext(cookieHeader?: string) {
    let endCallback: (() => void | Promise<void>) | null = null;
    const headerCalls: Array<{ name: string; value: string }> = [];

    const httpContext: any = {
        request: {
            headers: { get: (_: string) => cookieHeader },
            cookies: undefined as CookieCollection | undefined
        },
        response: {
            cookies: undefined as CookieCollection | undefined,
            onEnd: (callback: () => void | Promise<void>) => { endCallback = callback; },
            setHeader: (name: string, value: string) => { headerCalls.push({ name, value }); }
        }
    };

    return { ctx: httpContext, headerCalls, getEndCallback: () => endCallback! };
}

test('CookieMiddleware: initializes request and response cookies when no header', async (context: TestContext) => {
    const { ctx, headerCalls } = createFakeContext();
    const middleware = new CookieMiddleware();

    await middleware.onRequest(ctx, async () => { });

    context.assert.ok(ctx.request.cookies instanceof CookieCollection, 'request.cookies should be a CookieCollection');
    context.assert.ok(ctx.response.cookies instanceof CookieCollection, 'response.cookies should be a CookieCollection');
    context.assert.strictEqual(headerCalls.length, 0, 'no Set-Cookie headers should be sent');
});

test('CookieMiddleware: parses request cookies from header', async (context: TestContext) => {
    const header = 'foo=bar; baz=qux';
    const { ctx } = createFakeContext(header);
    const middleware = new CookieMiddleware();

    await middleware.onRequest(ctx, async () => { });

    context.assert.ok(ctx.request.cookies.has('foo'), 'should parse foo cookie');
    context.assert.strictEqual(ctx.request.cookies.get('foo')!.value, 'bar');
    context.assert.ok(ctx.request.cookies.has('baz'), 'should parse baz cookie');
    context.assert.strictEqual(ctx.request.cookies.get('baz')!.value, 'qux');
});

test('CookieMiddleware: flushes response cookies on end', async (context: TestContext) => {
    const { ctx, headerCalls, getEndCallback } = createFakeContext();
    const middleware = new CookieMiddleware();

    await middleware.onRequest(ctx, async () => { ctx.response.cookies.set('x', new Cookie('x', 'y')); });
    await getEndCallback()();

    context.assert.strictEqual(headerCalls.length, 1, 'one Set-Cookie header should be sent');
    context.assert.strictEqual(headerCalls[0].name, 'Set-Cookie');
    context.assert.ok(headerCalls[0].value.startsWith('x=y'), 'header value should start with x=y');
});