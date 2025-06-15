/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { SystemException } from "@contextjs/system";

export class DirectoryExistsException extends SystemException {
    public constructor(directory: string) {
        super(`The specified directory already exists: ${directory}`);
        this.name = DirectoryExistsException.name;
    }
}