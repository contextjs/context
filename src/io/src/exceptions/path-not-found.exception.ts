/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { SystemException } from "@contextjs/system";

export class PathNotFoundException extends SystemException {
    public constructor(path: string) {
        super(`The specified path was not found: ${path}`);
        this.name = PathNotFoundException.name;
    }
}