/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Dictionary } from "@contextjs/collections";
import { RouteDefinition } from "./route-definition.js";

export class ParsedRoute {
    public readonly definition: RouteDefinition;
    public readonly parameters: Dictionary<string, any>;

    public constructor(definition: RouteDefinition, parameters: Dictionary<string, any>) {
        this.definition = definition;
        this.parameters = parameters;
    }
}