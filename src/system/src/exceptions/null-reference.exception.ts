/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { SystemException } from "./system.exception.js";

export class NullReferenceException extends SystemException {
    public constructor(message?: string, options?: ErrorOptions) {
        super(message ?? "The specified reference is null or undefined.", options);
        this.name = NullReferenceException.name;
    }
}