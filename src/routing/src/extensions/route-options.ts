/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Route } from "../models/route.js";
import { RouteConfiguration } from "./route-configuration.js";

export class RouteOptions {
    protected routeConfiguration: RouteConfiguration;

    public constructor(routeConfiguration: RouteConfiguration) {
        this.routeConfiguration = routeConfiguration;
    }

    public discoverRoutes(): RouteOptions;
    public discoverRoutes(value: boolean): RouteOptions;
    public discoverRoutes(value?: boolean | null): RouteOptions {
        this.routeConfiguration.discoverRoutes = value ?? true;
        return this;
    }

    public useRoutes(routes: Route[]): RouteOptions {
        this.routeConfiguration.routes = routes;
        return this;
    }
}