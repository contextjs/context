/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import "reflect-metadata";

const controllerRegistry: Function[] = [];

export function Controller(template?: string): ClassDecorator {
    return (target) => {
        Reflect.defineMetadata('controller', target.name, target);
        if (template)
            Reflect.defineMetadata('controller:template', template, target);

        controllerRegistry.push(target);
    };
}

export function getRegisteredControllers() {
    return controllerRegistry;
}

export function clearRegisteredRoutes() {
    controllerRegistry.length = 0; // Clear the registry
}

export function getControllerMetadata(target: Function): string | undefined {
    return Reflect.getMetadata('controller', target);
}