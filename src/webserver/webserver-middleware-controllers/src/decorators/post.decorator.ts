/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Verb } from "./verb-decorator.js";

export function Post(template: string): MethodDecorator {
    return Verb(template, "POST");
}