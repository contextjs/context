/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { CookieCollection } from '../../src/models/cookie.collection.js';
import { Cookie } from '../../src/models/cookie.js';

test('CookieCollection: delete marks existing cookie as expired', (context: TestContext) => {
    const collection = new CookieCollection();
    const originalDate = new Date(Date.now() + 1000 * 60 * 60);
    const cookie = new Cookie('foo', 'bar');
    cookie.options.expires = originalDate;
    collection.set('foo', cookie);
    collection.delete('foo');
    const deleted = collection.get('foo');

    context.assert.ok(deleted);
    context.assert.strictEqual(deleted.options.expires!.getTime(), 0);
});

test('CookieCollection: delete on non-existent key does nothing', (context: TestContext) => {
    const collection = new CookieCollection();

    context.assert.doesNotThrow(() => collection.delete('nonexistent'));
    context.assert.strictEqual(collection.get('nonexistent'), null);
});
