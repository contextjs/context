/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/context-js/context/blob/main/LICENSE
 */

import { Exception } from "./exception.mjs";

export class PathNotFoundException extends Exception {
    public constructor(path: string) {
        super(`The specified path was not found: ${path}`);
        this.name = Exception.name;
    }
}