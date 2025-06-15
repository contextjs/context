/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { SystemException } from "@contextjs/system";

export class ParserException extends SystemException {
    public constructor(message: string) {
        super(message);
        this.name = ParserException.name;
    }
}