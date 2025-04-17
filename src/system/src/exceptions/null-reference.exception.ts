/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Exception } from "./exception.js";

export class NullReferenceException extends Exception {
    public constructor() {
        super("The specified reference is null or undefined.");
        this.name = NullReferenceException.name;
    }
}