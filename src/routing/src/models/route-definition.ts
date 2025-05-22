/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { RouteInfo } from "./route-info.js";

export class RouteDefinition<T extends RouteInfo = RouteInfo> {
    public importPath: string;
    public classReference: Function | null;
    public methodReference: Function | null;
    public route: T;

    constructor(
        importPath: string,
        classReference: Function | null,
        methodReference: Function | null,
        route: T) {
        this.importPath = importPath;
        this.classReference = classReference;
        this.methodReference = methodReference;
        this.route = route;
    }
}