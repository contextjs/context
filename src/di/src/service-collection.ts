/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { StringExtensions } from "@contextjs/system";

export class ServiceCollection {

    private dependencies = new Map<string, any>();

    public addTransient<TInterface, TImplementation>(): void { }
    public addSingleton<TInterface, TImplementation>(): void { }

    public resolve<T>(): T | null;
    public resolve<T>(interfaceName?: string): T | null {
        if (StringExtensions.isNullOrWhiteSpace(interfaceName))
            return null;


        return interfaceName as T;
    }
}