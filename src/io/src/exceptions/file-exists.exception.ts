/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { SystemException } from "@contextjs/system";

export class FileExistsException extends SystemException {
    public constructor(file: string) {
        super(`The specified file already exists: ${file}`);
        this.name = FileExistsException.name;
    }
}