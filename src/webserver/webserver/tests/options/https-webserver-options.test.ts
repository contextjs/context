/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { HttpsWebServerOptions } from '../../src/options/https-webserver-options.js';

test('HttpsWebServerOptions: Default constructor sets defaults', (context: TestContext) => {
    const defaultOptions = new HttpsWebServerOptions();

    context.assert.strictEqual(defaultOptions.enabled, false, 'Enabled should default to false');
    context.assert.strictEqual(defaultOptions.host, 'localhost', 'Host should default to localhost');
    context.assert.strictEqual(defaultOptions.port, 443, 'Port should default to 443');
    context.assert.strictEqual(defaultOptions.keepAliveTimeout, 5000, 'Keep-alive timeout should default to 5000');
    context.assert.deepEqual(defaultOptions.certificate, { cert: '', key: '' }, 'Certificate should default to empty cert and key');
});

test('HttpsWebServerOptions: Constructor with all custom values sets accordingly', (context: TestContext) => {
    const customCert = { cert: 'certPEM', key: 'keyPEM' };
    const customOptions = new HttpsWebServerOptions(true, 'example.com', 8443, customCert, 15000);

    context.assert.strictEqual(customOptions.enabled, true);
    context.assert.strictEqual(customOptions.host, 'example.com');
    context.assert.strictEqual(customOptions.port, 8443);
    context.assert.strictEqual(customOptions.keepAliveTimeout, 15000);
    context.assert.deepEqual(customOptions.certificate, customCert);
});

test('HttpsWebServerOptions: Constructor with partial undefined args uses defaults', (context: TestContext) => {
    const partialOptions = new HttpsWebServerOptions(undefined, 'myhost');

    context.assert.strictEqual(partialOptions.enabled, false, 'Enabled should default to false');
    context.assert.strictEqual(partialOptions.host, 'myhost', 'Host should use provided value');
    context.assert.strictEqual(partialOptions.port, 443, 'Port should default to 443');
    context.assert.strictEqual(partialOptions.keepAliveTimeout, 5000, 'Keep-alive timeout should default to 5000');
    context.assert.deepEqual(partialOptions.certificate, { cert: '', key: '' }, 'Certificate should default to empty cert and key');
});

test('HttpsWebServerOptions: normalize method assigns provided values', (context: TestContext) => {
    const instance = Object.create(HttpsWebServerOptions.prototype);
    instance.normalize(true, 'h', 1234, { cert: 'C', key: 'K' }, 6000);

    context.assert.strictEqual(instance.enabled, true);
    context.assert.strictEqual(instance.host, 'h');
    context.assert.strictEqual(instance.port, 1234);
    context.assert.strictEqual(instance.keepAliveTimeout, 6000);
    context.assert.deepEqual(instance.certificate, { cert: 'C', key: 'K' });
});