/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { TextException } from "./text.exception.js";

export class TrackingStringBuilderException extends TextException {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
        this.name = TrackingStringBuilderException.name;
    }
}