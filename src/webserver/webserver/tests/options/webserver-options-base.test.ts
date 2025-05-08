/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { WebServerOptionsBase } from '../../src/options/webserver-options-base.js';

test('WebServerOptionsBase: properties exist and can be assigned', (context: TestContext) => {
    const optionsBase = new WebServerOptionsBase();

    context.assert.strictEqual(optionsBase.enabled, undefined);
    context.assert.strictEqual(optionsBase.port, undefined);
    context.assert.strictEqual(optionsBase.host, undefined);
    context.assert.strictEqual(optionsBase.keepAliveTimeout, undefined);

    optionsBase.enabled = false;
    optionsBase.host = '127.0.0.1';
    optionsBase.port = 8000;
    optionsBase.keepAliveTimeout = 3000;

    context.assert.strictEqual(optionsBase.enabled, false);
    context.assert.strictEqual(optionsBase.host, '127.0.0.1');
    context.assert.strictEqual(optionsBase.port, 8000);
    context.assert.strictEqual(optionsBase.keepAliveTimeout, 3000);
});