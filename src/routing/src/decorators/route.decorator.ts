/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { RouteInfo } from "../models/route-info.js";

const ROUTE_KEY = Symbol("contextjs:route");

export function Route(template: string, name?: string): MethodDecorator {
    return (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
        if (!propertyKey || !descriptor || typeof descriptor.value !== "function")
            throw new Error("@Route decorator can only be applied to methods.");

        descriptor.value[ROUTE_KEY] = new RouteInfo(template, name ?? null);
    };
}

export function getRouteMetadata(target: any, propertyKey: string | symbol): RouteInfo | undefined {
    const propertyDescriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
    if (propertyDescriptor && typeof propertyDescriptor.value === "function")
        return propertyDescriptor.value[ROUTE_KEY];

    return undefined;
}