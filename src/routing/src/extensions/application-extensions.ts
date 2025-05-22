/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Application } from "@contextjs/system";
import { RouteDefinition } from "../models/route-definition.js";
import { RouteDiscoveryService } from "../services/route-discovery-service.js";

declare module "@contextjs/system" {
    export interface Application {
        routes: RouteDefinition[];
        useRouting(): Application;
    }
}

Application.prototype.useRouting = function (): Application {
    this.onRun(async () => this.routes = await RouteDiscoveryService.discoverRoutesAsync());
    return this;
}