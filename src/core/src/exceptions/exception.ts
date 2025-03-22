/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

export class Exception extends Error {
    constructor(message: string) {
        super(message);
        this.name = Exception.name;
    }
}