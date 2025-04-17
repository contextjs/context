/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ConstructorParameter } from "../models/constructor-parameter.js";
import { ServiceLifetime } from "../models/service-lifetime.js";
import { Service } from "../models/service.js";

export class DependencyInjectionOptions {
    public onResolve?: (context: {
        name: string;
        lifetime: ServiceLifetime;
        parameters: ConstructorParameter[];
        service: Service;
    }) => any | null;
}