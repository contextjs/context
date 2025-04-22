/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ConfigurationOptions } from "@contextjs/configuration";
import { Throw } from "@contextjs/system";
import { JsonConfigurationOptions } from "../json-configuration-options.js";
import { JsonConfigurationProvider } from "../json-configuration.provider.js";

declare module "@contextjs/configuration" {
    export interface ConfigurationOptions {
        useJsonConfiguration(options: (configurationOptions: JsonConfigurationOptions) => void): ConfigurationOptions;
    }
}

ConfigurationOptions.prototype.useJsonConfiguration = function (options: (configurationOptions: JsonConfigurationOptions) => void): ConfigurationOptions {
    Throw.ifNullOrUndefined(options);

    const jsonConfigurationProvider = new JsonConfigurationProvider(this.configuration.application.environment);
    this.configuration.providers.push(jsonConfigurationProvider);

    options(new JsonConfigurationOptions(jsonConfigurationProvider));

    return this;
};