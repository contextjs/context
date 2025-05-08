/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { GeneralWebServerOptions } from '../../src/options/general-webserver-options.js';

test('GeneralWebServerOptions: Default constructor sets defaults and aligns maximumHeaderSize', (context: TestContext) => {
    const defaultOptions = new GeneralWebServerOptions();

    context.assert.strictEqual(defaultOptions.maximumHeaderSize, 32 * 1024);
    context.assert.strictEqual(defaultOptions.httpContextPoolSize, 1024);
    context.assert.strictEqual(defaultOptions.idleSocketsTimeout, 5000);
});

test('GeneralWebServerOptions: Constructor aligns maximumHeaderSize to at least 1024 when below minimum', (context: TestContext) => {
    const smallHeaderOptions = new GeneralWebServerOptions(512);

    context.assert.strictEqual(smallHeaderOptions.maximumHeaderSize, 1024, 'Should align to minimum 1024');
    context.assert.strictEqual(smallHeaderOptions.httpContextPoolSize, 1024, 'Default pool size when not provided');
    context.assert.strictEqual(smallHeaderOptions.idleSocketsTimeout, 5000, 'Default timeout when not provided');
});

test('GeneralWebServerOptions: Constructor aligns maximumHeaderSize up to next multiple of 1024', (context: TestContext) => {
    const unalignedSize = 1500;
    const expectedAlignedSize = Math.ceil(unalignedSize / 1024) * 1024;
    const unalignedHeaderOptions = new GeneralWebServerOptions(unalignedSize);

    context.assert.strictEqual(unalignedHeaderOptions.maximumHeaderSize, expectedAlignedSize, `Should align ${unalignedSize} up to ${expectedAlignedSize}`);
});

test('GeneralWebServerOptions: Constructor accepts all custom values and aligns header size correctly', (context: TestContext) => {
    const customHeaderSize = 2048;
    const customPoolSize = 500;
    const customIdleTimeout = 10000;
    const customOptions = new GeneralWebServerOptions(customHeaderSize, customPoolSize, customIdleTimeout);

    context.assert.strictEqual(customOptions.maximumHeaderSize, customHeaderSize, 'Should retain exact multiple of 1024');
    context.assert.strictEqual(customOptions.httpContextPoolSize, customPoolSize, 'Should set custom pool size');
    context.assert.strictEqual(customOptions.idleSocketsTimeout, customIdleTimeout, 'Should set custom idle timeout');
});

test('GeneralWebServerOptions: Constructor with undefined first argument uses default header size', (context: TestContext) => {
    const customPoolOnly = 2048;
    const customTimeoutOnly = 2000;
    const poolTimeoutOptions = new GeneralWebServerOptions(undefined, customPoolOnly, customTimeoutOnly);

    context.assert.strictEqual(poolTimeoutOptions.maximumHeaderSize, 32 * 1024, 'Default header size when undefined');
    context.assert.strictEqual(poolTimeoutOptions.httpContextPoolSize, customPoolOnly);
    context.assert.strictEqual(poolTimeoutOptions.idleSocketsTimeout, customTimeoutOnly);
});

test('GeneralWebServerOptions: normalize method assigns provided values', (context: TestContext) => {
    const instance: any = Object.create(GeneralWebServerOptions.prototype);
    instance.normalize(2048, 900, 2000);

    context.assert.strictEqual(instance.maximumHeaderSize, 2048);
    context.assert.strictEqual(instance.httpContextPoolSize, 900);
    context.assert.strictEqual(instance.idleSocketsTimeout, 2000);
});