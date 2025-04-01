/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { File } from '@contextjs/io';
import { Environment, EnvironmentName, NullReferenceException } from '@contextjs/system';
import { test, TestContext } from 'node:test';
import { JsonConfigurationOptions } from '../src/json-configuration-options';
import { JsonConfigurationProvider } from '../src/json-configuration.provider';

test('JsonConfigurationOptions: constructor - success', (context: TestContext) => {
    const options = new JsonConfigurationOptions({} as any);

    context.assert.notStrictEqual(options, null);
    context.assert.strictEqual(options instanceof JsonConfigurationOptions, true);
});

test('JsonConfigurationOptions: constructor - failure', (context: TestContext) => {
    context.assert.throws(() => new JsonConfigurationOptions(null!), NullReferenceException);
});

test('JsonConfigurationOptions: useFile - success', (context: TestContext) => {
    context.mock.method(File, 'exists', () => true);
    context.mock.method(File, 'read', () => '{"key":"value"}');

    const environment = new Environment();
    environment.name = EnvironmentName.development;
    const provider = new JsonConfigurationProvider(environment);
    const options = new JsonConfigurationOptions(provider);

    context.assert.doesNotThrow(() => options.useFile('file'));
});