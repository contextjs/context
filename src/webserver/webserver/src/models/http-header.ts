/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Throw } from "@contextjs/system";

export class HttpHeader {
    public constructor(
        public readonly name: string,
        public value: number | string | string[]) {
        Throw.ifNullOrWhiteSpace(name);
        Throw.ifNullOrUndefined(value);
    }
}