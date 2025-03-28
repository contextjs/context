import { Application, ObjectExtensions, StringExtensions } from "@contextjs/core";
import { IConfigurationProvider } from "./interfaces/i-configuration.provider.js";

export class Configuration {
    public readonly application: Application;
    public readonly providers: IConfigurationProvider[] = [];
    public useEnvironmentVariables: boolean = false;

    public constructor(application: Application) {
        this.application = application;
    }

    public async getValueAsync(key: string): Promise<any> {
        if (StringExtensions.isNullOrWhiteSpace(key))
            return null;

        for (const provider of this.providers) {
            const value = await provider.getValueAsync(key);
            if (!ObjectExtensions.isNullOrUndefined(value))
                return value;
        }

        return null;
    }
}