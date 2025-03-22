/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Exception } from "./exception.js";

export class FileNotFoundException extends Exception {
    public constructor(file: string) {
        super(`The specified file was not found: ${file}`);
        this.name = Exception.name;
    }
}