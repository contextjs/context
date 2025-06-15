/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Throw } from "@contextjs/system";
import { RouteService } from "../services/route.service.js";

export class RouteInfo {
    public readonly template: string;
    public readonly name: string | null;
    public readonly decodedTemplate: string;

    public constructor(template: string, name: string | null = null) {
        Throw.ifNullOrWhitespace(template);

        this.template = template;
        this.name = name;
        this.decodedTemplate = RouteService.decode(template);
    }
}