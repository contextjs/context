/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { RouteInfo } from "./route-info.js";

export class RouteDefinition<T extends RouteInfo = RouteInfo> {
    public readonly className: string | null;
    public readonly methodName: string | null;
    public readonly route: T;

    constructor(className: string | null, methodName: string | null, route: T) {
        this.className = className;
        this.methodName = methodName;
        this.route = route;
    }
}