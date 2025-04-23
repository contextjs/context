/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { SystemException } from "./system.exception.js";

/**
 * Represents an exception thrown when a provided expression is not valid for extraction.
 */
export class InvalidExpressionException extends SystemException {
    /**
     * Creates a new instance of the InvalidExpressionException class.
     *
     * @param message The error message that explains the reason for the exception.
     * @param options Optional error options.
     */
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
        this.name = "InvalidExpressionException";
    }
}
