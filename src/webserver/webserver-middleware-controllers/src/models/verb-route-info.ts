/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { RouteInfo } from "@contextjs/routing";
import { HttpVerb } from "@contextjs/webserver";

export class VerbRouteInfo extends RouteInfo {
    public readonly verb: HttpVerb;

    constructor(verb: HttpVerb, template: string) {
        super(template);
        this.verb = verb;
    }
}