/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/context-js/context/blob/main/LICENSE
 */

import { Exception } from "./exception.mjs";

export class NullReferenceException extends Exception {
    public constructor() {
        super('Object reference not set to an instance of an object.');
        this.name = Exception.name;
    }
}