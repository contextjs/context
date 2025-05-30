/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { HttpVerb } from "@contextjs/webserver";
import { Verb } from "./verb-decorator.js";

export function Get(template: string): MethodDecorator {
    return Verb(template, HttpVerb.GET);
}