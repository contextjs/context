/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Exception } from "./exception.js";

export class SystemException extends Exception {
    constructor(message?: string, options?: ErrorOptions) {
        super(message ?? "A system error has occurred.", options);
        this.name = SystemException.name;
    }
}