/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Route } from "../models/route.js";

export class RouteConfiguration {
    public discoverRoutes: boolean = false;
    public routes: Route[] = [];
}