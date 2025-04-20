/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Application } from '@contextjs/system';
import { test, TestContext } from 'node:test';
import { ConfigurationOptions } from '../src/configuration-options.ts';
import { Configuration } from '../src/configuration.ts';
import '../src/extensions/application-extensions.ts';
import { IConfigurationProvider } from '../src/interfaces/i-configuration.provider.ts';

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

test("ConfigurationOptions: instance - success", (context: TestContext) => {
    const application = new Application();
    const configuration = new Configuration(application);
    const options = new ConfigurationOptions(configuration);

    context.assert.strictEqual(options.configuration, configuration);
});

test("ConfigurationOptions: useProvider - success", (context: TestContext) => {
    class Provider implements IConfigurationProvider {
        async getValueAsync(key: string) {
            return key;
        }
    }

    const configuration = new Configuration(new Application());
    const options = new ConfigurationOptions(configuration);
    const provider = new Provider();

    options.useProvider(provider);

    context.assert.strictEqual(configuration.providers.length, 1);
    context.assert.strictEqual(configuration.providers[0], provider);
});

test("ConfigurationOptions: useEnvironmentVariables - sets flag to true", (context: TestContext) => {
    const configuration = new Configuration(new Application());
    const options = new ConfigurationOptions(configuration);

    configuration.useEnvironmentVariables = false;
    options.useEnvironmentVariables();

    context.assert.strictEqual(configuration.useEnvironmentVariables, true);
});
