/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { NullReferenceException } from '@contextjs/system';
import test, { TestContext } from 'node:test';
import { RouteInfo } from '../../src/models/route-info.ts';

test('Route: contructor - success - with name', (context: TestContext) => {
    const route = new RouteInfo('/home/index.html', 'home');

    context.assert.strictEqual(route.template, '/home/index.html');
    context.assert.strictEqual(route.name, 'home');
});

test('Route: contructor - success - without name', (context: TestContext) => {
    const route = new RouteInfo('/home/index.html');
    context.assert.strictEqual(route.template, '/home/index.html');
    context.assert.strictEqual(route.name, null);
});

test('Route: constructor - should throw if template is empty', (context: TestContext) => {
    context.assert.throws(() => new RouteInfo(""), NullReferenceException);
    context.assert.throws(() => new RouteInfo("   "), NullReferenceException);
    context.assert.throws(() => new RouteInfo(null as any), NullReferenceException);
});