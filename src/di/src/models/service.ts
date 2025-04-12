/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ServiceLifetime } from "../enums/service-lifetime.js";

export class Service {
    public readonly lifetime: ServiceLifetime;
    public readonly type: any;
    public instance: any | null = null;

    public constructor(lifetime: ServiceLifetime, type: any) {
        this.lifetime = lifetime;
        this.type = type;
    }
}