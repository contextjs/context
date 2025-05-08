/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { HttpContextPool } from '../../src/models/http-context-pool.js';
import { HttpContextPoolException } from '../../src/exceptions/http-context-pool.exception.js';
import { HttpContext } from '../../src/models/http-context.js';

test('HttpContextPool: constructor throws for non-positive size', (context: TestContext) => {
    context.assert.throws(() => new HttpContextPool(0), HttpContextPoolException);
});

test('HttpContextPool: constructor throws for non-power-of-two size', (context: TestContext) => {
    context.assert.throws(() => new HttpContextPool(3), HttpContextPoolException);
});

test('HttpContextPool: acquire returns new instances when pool is empty', (context: TestContext) => {
    const pool = new HttpContextPool(4);
    const ctx1 = pool.acquire();
    const ctx2 = pool.acquire();

    context.assert.ok(ctx1 instanceof HttpContext);
    context.assert.ok(ctx2 instanceof HttpContext);
    context.assert.notStrictEqual(ctx1, ctx2);
});

test('HttpContextPool: release returns this for chaining', (context: TestContext) => {
    const pool = new HttpContextPool(4);
    const ctx = new HttpContext();
    const returned = pool.release(ctx);
    
    context.assert.strictEqual(returned, pool);
});

test('HttpContextPool: released context is reused by next acquire', (context: TestContext) => {
    const pool = new HttpContextPool(2);
    const ctx = new HttpContext();
    pool.release(ctx);

    const reused = pool.acquire();
    context.assert.strictEqual(reused, ctx);

    const fresh = pool.acquire();
    context.assert.ok(fresh instanceof HttpContext);
    context.assert.notStrictEqual(fresh, ctx);
});

test('HttpContextPool: works correctly across multiple releases and acquires', (context: TestContext) => {
    const pool = new HttpContextPool(2);
    const a = new HttpContext();
    const b = new HttpContext();
    pool.release(a).release(b);

    const first = pool.acquire();
    const second = pool.acquire();
    context.assert.strictEqual(first, a);
    context.assert.strictEqual(second, b);

    const third = pool.acquire();
    context.assert.ok(third instanceof HttpContext);
    context.assert.notStrictEqual(third, a);
    context.assert.notStrictEqual(third, b);
});