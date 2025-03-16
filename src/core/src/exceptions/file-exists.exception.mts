/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/context-js/context/blob/main/LICENSE
 */

import { Exception } from "./exception.mjs";

export class FileExistsException extends Exception {
    public constructor(file: string) {
        super(`The specified file already exists: ${file}`);
        this.name = Exception.name;
    }
}