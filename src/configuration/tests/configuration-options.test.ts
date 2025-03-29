/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Application } from '@contextjs/core';
import { test, TestContext } from 'node:test';
import { ConfigurationOptions } from '../src/configuration-options.ts';
import { Configuration } from '../src/configuration.ts';
import '../src/extensions/application-extensions.ts';
import { IConfigurationProvider } from '../src/interfaces/i-configuration.provider.ts';

test('ConfigurationOptions: instance - success', (context: TestContext) => {
    const application = new Application();
    const configuration = new Configuration(application);
    const configurationOptions = new ConfigurationOptions(configuration);

    context.assert.notStrictEqual(configurationOptions, null);
    context.assert.strictEqual(configurationOptions.configuration, configuration);
});

test('ConfigurationOptions: useProvider - success', (context: TestContext) => {
    class Provider implements IConfigurationProvider {
        public load(source: any): IConfigurationProvider {
            return this;
        }

        public async getValueAsync(key: string) {
            return key;
        }
    }

    const application = new Application();
    const configuration = new Configuration(application);
    const configurationOptions = new ConfigurationOptions(configuration);
    const provider = new Provider();

    configurationOptions.useProvider(provider);

    context.assert.strictEqual(configuration.providers.length, 1);
    context.assert.strictEqual(configuration.providers[0], provider);
});

test('ConfigurationOptions: useEnvironmentVariables - success true', (context: TestContext) => {
    const application = new Application();
    const configuration = new Configuration(application);
    const configurationOptions = new ConfigurationOptions(configuration);

    configurationOptions.useEnvironmentVariables();

    context.assert.strictEqual(configuration.useEnvironmentVariables, true);
});

test('ConfigurationOptions: useEnvironmentVariables - success false', (context: TestContext) => {
    const application = new Application();
    const configuration = new Configuration(application);
    const configurationOptions = new ConfigurationOptions(configuration);

    configuration.useEnvironmentVariables = false;
    configurationOptions.useEnvironmentVariables();

    context.assert.strictEqual(configuration.useEnvironmentVariables, true);
});