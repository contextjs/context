/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ObjectExtensions } from '@contextjs/system';

export function Route(template: string, name?: string): MethodDecorator {
    return (target, propertyKey, descriptor) => {
        Reflect.defineMetadata('template', template, descriptor.value!);
        if (!ObjectExtensions.isNullOrUndefined(name))
            Reflect.defineMetadata('name', name, descriptor.value!);
    };
}