/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { Route } from '../../src/models/route.ts';

test('Route: contructor - success - with name', (context: TestContext) => {
    const route = new Route('/home/index.html', 'home');

    context.assert.strictEqual(route.template, '/home/index.html');
    context.assert.strictEqual(route.name, 'home');
});

test('Route: contructor - success - without name', (context: TestContext) => {
    const route = new Route('/home/index.html');
    context.assert.strictEqual(route.template, '/home/index.html');
    context.assert.strictEqual(route.name, null);
});