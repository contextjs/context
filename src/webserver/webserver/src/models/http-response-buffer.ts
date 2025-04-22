/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

export class HttpResponseBuffer {
    public constructor(
        public readonly value: any,
        public readonly encoding: BufferEncoding = "utf8") { }
}