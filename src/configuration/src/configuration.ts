/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Application, ObjectExtensions, StringExtensions } from "@contextjs/system";
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