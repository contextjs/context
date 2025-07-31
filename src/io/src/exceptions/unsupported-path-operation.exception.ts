/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { SystemException } from "@contextjs/system";

export class UnsupportedPathOperationException extends SystemException {
    public constructor(operation: string) {
        super(`The specified path operation is not supported: ${operation}`);
        this.name = UnsupportedPathOperationException.name;
    }
}