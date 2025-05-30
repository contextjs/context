/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import "reflect-metadata";

const routeRegistry: { target: Object; propertyKey: string | symbol; template: string; name?: string }[] = [];
export const ROUTE_META = Symbol("contextjs:routing:route");

export function Route(template: string, name?: string): MethodDecorator {
    return (target, propertyKey, descriptor) => {
        Reflect.defineMetadata(ROUTE_META, { template, name }, descriptor.value!);
        routeRegistry.push({ target, propertyKey, template, name });
    };
}

export function getRegisteredRoutes() {
    return routeRegistry;
}

export function clearRegisteredRoutes() {
    routeRegistry.length = 0;
}