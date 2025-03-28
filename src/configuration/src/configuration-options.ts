import { IConfigurationProvider } from "./interfaces/i-configuration.provider.js";
import { Configuration } from "./configuration.js";

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