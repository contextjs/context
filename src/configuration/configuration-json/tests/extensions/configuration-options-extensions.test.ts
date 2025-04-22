/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import "@contextjs/configuration";
import { FileNotFoundException } from "@contextjs/io";
import { Application } from "@contextjs/system";
import { test, TestContext } from 'node:test';
import "../../src/extensions/configuration-options-extensions.ts";

test('ConfigurationOptions: useJsonConfiguration - success', (context: TestContext) => {
    const application = new Application();
    application.useConfiguration(configurationOptions => {
        configurationOptions.useJsonConfiguration(() => { });
    });
    const jsonConfigurationProvider = application.configuration.providers[0];

    context.assert.notStrictEqual(jsonConfigurationProvider, null);
});

test('ConfigurationOptions: useJsonConfiguration - throws FileNotFoundException', (context: TestContext) => {
    const application = new Application();

    context.assert.throws(() => {
        application.useConfiguration(configurationOptions => {
            configurationOptions.useJsonConfiguration((jsonConfigurationOptions) => {
                jsonConfigurationOptions.useFile('test.json');
            });
        });
    }, FileNotFoundException);
});