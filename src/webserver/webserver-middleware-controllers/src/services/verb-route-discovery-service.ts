/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { RouteDefinition } from "@contextjs/routing";
import { StringExtensions } from "@contextjs/system";
import "reflect-metadata";
import { VERB_ROUTE_META } from "../decorators/verb-decorator.js";
import { ControllerDefinition } from "../models/controller-definition.js";
import { VerbRouteInfo } from "../models/verb-route-info.js";

export class VerbRouteDiscoveryService {
    public static async discoverAsync(
        controllerClass: Function,
        controllerDefinition: ControllerDefinition): Promise<RouteDefinition[]> {
        const routes: RouteDefinition[] = [];
        const controllerTemplate = controllerDefinition.route?.decodedTemplate;

        for (const propName of Object.getOwnPropertyNames(controllerClass.prototype)) {
            if (propName === "constructor")
                continue;

            const methodHandler = controllerClass.prototype[propName];

            if (!Reflect.hasMetadata(VERB_ROUTE_META, methodHandler))
                continue;

            const { template, verb } = Reflect.getMetadata(VERB_ROUTE_META, methodHandler);
            const fullTemplate = template.startsWith("/") || StringExtensions.isNullOrWhiteSpace(controllerTemplate)
                ? template
                : `${controllerTemplate}/${template}`;
            const routeInfo = new VerbRouteInfo(verb, fullTemplate);
            routes.push(new RouteDefinition(controllerClass.name, propName, routeInfo));
        }

        return routes;
    }
}