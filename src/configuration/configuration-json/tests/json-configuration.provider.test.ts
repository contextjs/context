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

test('JsonConfigurationProvider: getValueAsync - fallback to default file', async (context: TestContext) => {
    context.mock.method(File, 'exists', () => true);
    context.mock.method(File, 'read', () => '{"key":"fallback"}');

    const environment = new Environment();
    environment.name = EnvironmentName.development;

    const provider = new JsonConfigurationProvider(environment);
    provider.addFile("fallback.json");

    const result = await provider.getValueAsync("key");
    context.assert.strictEqual(result, "fallback");
});

test('JsonConfigurationProvider: getValueAsync - nested key success', async (context: TestContext) => {
    context.mock.method(File, 'exists', () => true);
    context.mock.method(File, 'read', () => '{"app":{"port":3000}}');

    const environment = new Environment();
    environment.name = EnvironmentName.development;

    const provider = new JsonConfigurationProvider(environment);
    provider.addFile("nested.json", EnvironmentName.development);

    const result = await provider.getValueAsync("app:port");
    context.assert.strictEqual(result, 3000);
});

test('JsonConfigurationProvider: getValueAsync - missing nested key returns null', async (context: TestContext) => {
    context.mock.method(File, 'exists', () => true);
    context.mock.method(File, 'read', () => '{"app":{"port":3000}}');

    const environment = new Environment();
    environment.name = EnvironmentName.development;

    const provider = new JsonConfigurationProvider(environment);
    provider.addFile("nested.json", EnvironmentName.development);

    const result = await provider.getValueAsync("app:host");
    context.assert.strictEqual(result, null);
});