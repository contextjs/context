/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Exception } from "@contextjs/system";

export class DirectoryExistsException extends Exception {
    public constructor(directory: string) {
        super(`The specified directory already exists: ${directory}`);
        this.name = Exception.name;
    }
}