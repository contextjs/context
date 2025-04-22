/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { IConfigurationProvider } from "@contextjs/configuration";
import { Environment, ObjectExtensions } from "@contextjs/system";
import { EnvironmentFile } from "./models/environment-file.js";

export class JsonConfigurationProvider implements IConfigurationProvider {
    private readonly files: EnvironmentFile[] = [];

    public constructor(private readonly environment: Environment) { }

    public addFile(file: string, environmentName: string | null = null): void {
        this.files.push(new EnvironmentFile(file, environmentName || null));
    }

    public async getValueAsync(key: string): Promise<any> {
        const keys = key.split(':');

        const result =
            this.getValueFromFile(keys, this.environment.name) ??
            this.getValueFromFile(keys, null);

        return result;
    }

    private getValueFromFile(keys: string[], environmentName: string | null): any {
        const file = this.files.find(file => file.environmentName === environmentName);
        if (ObjectExtensions.isNullOrUndefined(file))
            return null;

        return this.tryGet(keys, file!.content);
    }

    private tryGet(keys: string[], content: any): any {
        return keys.reduce((previous, current) => previous && previous[current], content);
    }
}