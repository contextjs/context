/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { File } from '@contextjs/io';
import { Environment, EnvironmentName, } from '@contextjs/system';
import { test, TestContext } from 'node:test';
import { JsonConfigurationProvider } from '../src/json-configuration.provider';

test('JsonConfigurationProvider: constructor - success', (context: TestContext) => {
    const environment = new Environment();
    environment.name = EnvironmentName.development;
    const provider = new JsonConfigurationProvider(environment);

    context.assert.notStrictEqual(provider, null);
    context.assert.notStrictEqual(provider, undefined);
    context.assert.strictEqual(provider instanceof JsonConfigurationProvider, true);
});

test('JsonConfigurationProvider: getValueAsync - success', async (context: TestContext) => {
    context.mock.method(File, 'exists', () => true);
    context.mock.method(File, 'read', () => '{"key":"value"}');

    const environment = new Environment();
    environment.name = EnvironmentName.development;
    const provider = new JsonConfigurationProvider(environment);
    provider.addFile('test', EnvironmentName.development);

    const result = await provider.getValueAsync('key');
    context.assert.strictEqual(result, 'value');
});

test('JsonConfigurationProvider: getValue - no file', async (context: TestContext) => {
    const environment = new Environment();
    environment.name = EnvironmentName.development;
    const provider = new JsonConfigurationProvider(environment);

    const result = await provider.getValueAsync('key');
    context.assert.strictEqual(result, null);
});