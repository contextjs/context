/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Throw } from "@contextjs/system";

export class Route {
    public readonly template: string;
    public readonly name: string | null;

    public constructor(template: string, name: string | null = null) {
        Throw.ifNullOrWhiteSpace(template);

        this.template = template;
        this.name = name;
    }
}