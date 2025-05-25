/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { RouteInfo } from "./route-info.js";

export class RouteDefinition<T extends RouteInfo = RouteInfo> {
    public readonly importPath: string;
    public readonly className: string | null;
    public readonly methodName: string | null;
    public readonly isMethodNameAsync: boolean = false;
    public readonly route: T;

    constructor(importPath: string, className: string | null, methodName: string | null, isMethodNameAsync: boolean, route: T) {
        this.importPath = importPath;
        this.className = className;
        this.methodName = methodName;
        this.isMethodNameAsync = isMethodNameAsync;
        this.route = route;
    }
}