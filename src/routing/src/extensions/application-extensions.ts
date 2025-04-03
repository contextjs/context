/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Application, Throw } from "@contextjs/system";
import { RouteConfiguration } from "./route-configuration.js";
import { RouteOptions } from "./route-options.js";

declare module "@contextjs/system" {
    export interface Application {
        routeConfiguration: RouteConfiguration;
        useRouting(options: (routeOptions: RouteOptions) => void): Application;
    }
}

Application.prototype.useRouting = function (options: (routeOptions: RouteOptions) => void): Application {
    Throw.ifNullOrUndefined(options);

    this.routeConfiguration = new RouteConfiguration();
    options(new RouteOptions(this.routeConfiguration));

    return this;
}