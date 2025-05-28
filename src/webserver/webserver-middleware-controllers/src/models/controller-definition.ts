/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { RouteInfo } from "@contextjs/routing";
import { StringExtensions } from "@contextjs/system";

export class ControllerDefinition {
    public readonly name: string;
    public readonly classReference: Function;
    public readonly route: RouteInfo;

    constructor(name: string, classReference: Function, template?: string) {
        this.name = name;
        this.classReference = classReference;
        this.route = this.createRoute(template);
    }

    private createRoute(template?: string): RouteInfo {
        if (StringExtensions.isNullOrWhiteSpace(template))
            return new RouteInfo(`${this.getControllerName()}`);

        template = template.trim().toLowerCase();

        if (template.startsWith("/"))
            template = template.substring(1);

        if (template.endsWith("/"))
            template = template.substring(0, template.length - 1);

        if (template.includes("[controller]"))
            template = template.replace("[controller]", this.getControllerName());

        return new RouteInfo(template);
    }

    private getControllerName(): string {
        const name = this.name.toLowerCase();
        if (name.endsWith("controller"))
            return name.substring(0, name.length - 10);

        return name;
    }
}