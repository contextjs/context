import { Application, Throw } from "@contextjs/core";
import { ConfigurationOptions } from "../configuration-options.js";
import { Configuration } from "../configuration.js";

declare module "@contextjs/core" {
    export interface Application {
        useConfiguration(options: (configurationOptions: ConfigurationOptions) => void): Application;
        configuration: Configuration;
    }
}

Application.prototype.useConfiguration = function (options: (configurationOptions: ConfigurationOptions) => void): Application {
    Throw.ifNullOrUndefined(options);

    this.configuration = new Configuration(this);
    options(new ConfigurationOptions(this.configuration));

    return this;
};
