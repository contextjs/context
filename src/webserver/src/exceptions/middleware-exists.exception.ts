/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Exception } from "@contextjs/system";

export class MiddlewareExistsException extends Exception {
    public constructor(name: string) {
        super(`The specified middleware already exists: ${name}`);
        this.name = MiddlewareExistsException.name;
    }
}