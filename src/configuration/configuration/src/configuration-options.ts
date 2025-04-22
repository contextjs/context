/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Configuration } from "./configuration.js";
import { IConfigurationProvider } from "./interfaces/i-configuration.provider.js";

export class ConfigurationOptions {
    public readonly configuration: Configuration;

    public constructor(configuration: Configuration) {
        this.configuration = configuration;
    }

    public useProvider(provider: IConfigurationProvider): ConfigurationOptions {
        this.configuration.providers.push(provider);
        return this;
    }

    public useEnvironmentVariables(): ConfigurationOptions {
        this.configuration.useEnvironmentVariables = true;
        return this;
    }
}