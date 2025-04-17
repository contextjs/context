/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ConstructorParameter } from "./constructor-parameter.js";
import { ServiceLifetime } from "./service-lifetime.js";

export class Service {
    public readonly lifetime: ServiceLifetime;
    public readonly type: any;
    public readonly parameters: ConstructorParameter[];

    public constructor(type: any, lifetime: ServiceLifetime, parameters: ConstructorParameter[]) {
        this.type = type;
        this.lifetime = lifetime;
        this.parameters = parameters;
    }
}