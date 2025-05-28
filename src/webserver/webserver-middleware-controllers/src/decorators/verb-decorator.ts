/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { HttpVerb } from "@contextjs/webserver";

export const VERB_ROUTE_META = Symbol("contextjs:routing:verb");

export function Verb(template: string, verb: HttpVerb): MethodDecorator {
    return (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
        Reflect.defineMetadata(VERB_ROUTE_META, { template, verb }, descriptor.value);
    };
}