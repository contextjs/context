/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Throw } from "@contextjs/system";
import { JsonConfigurationProvider } from "./json-configuration.provider.js";

export class JsonConfigurationOptions {
    public constructor(private readonly provider: JsonConfigurationProvider) {
        Throw.ifNullOrUndefined(provider);
    }

    public useFile(file: string, environmentName: string | null = null): JsonConfigurationOptions {
        this.provider.addFile(file, environmentName);

        return this;
    }
}