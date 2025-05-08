/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { HttpWebServerOptions } from '../../src/options/http-webserver-options.js';

test('HttpWebServerOptions: Default constructor sets defaults', (context: TestContext) => {
    const defaultOptions = new HttpWebServerOptions();

    context.assert.strictEqual(defaultOptions.enabled, true, 'Enabled should default to true');
    context.assert.strictEqual(defaultOptions.host, 'localhost', 'Host should default to localhost');
    context.assert.strictEqual(defaultOptions.port, 80, 'Port should default to 80');
    context.assert.strictEqual(defaultOptions.keepAliveTimeout, 5000, 'Keep-alive timeout should default to 5000');
});

test('HttpWebServerOptions: Constructor with all custom values sets accordingly', (context: TestContext) => {
    const customOptions = new HttpWebServerOptions(false, 'example.com', 8080, 10000);

    context.assert.strictEqual(customOptions.enabled, false);
    context.assert.strictEqual(customOptions.host, 'example.com');
    context.assert.strictEqual(customOptions.port, 8080);
    context.assert.strictEqual(customOptions.keepAliveTimeout, 10000);
});

test('HttpWebServerOptions: Constructor with partial undefined args uses defaults', (context: TestContext) => {
    const partialOptions = new HttpWebServerOptions(undefined, 'myhost');

    context.assert.strictEqual(partialOptions.enabled, true);
    context.assert.strictEqual(partialOptions.host, 'myhost');
    context.assert.strictEqual(partialOptions.port, 80);
    context.assert.strictEqual(partialOptions.keepAliveTimeout, 5000);
});

test('HttpWebServerOptions: normalize method assigns provided values', (context: TestContext) => {
    const instance: any = Object.create(HttpWebServerOptions.prototype);
    instance.normalize(false, 'h', 900, 2000);

    context.assert.strictEqual(instance.enabled, false);
    context.assert.strictEqual(instance.host, 'h');
    context.assert.strictEqual(instance.port, 900);
    context.assert.strictEqual(instance.keepAliveTimeout, 2000);
});