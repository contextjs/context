/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ParserResult } from "@contextjs/views-parser";

export class CompiledView<T = unknown> {
    public readonly filePath: string;
    public readonly kind: string;
    public readonly parserResult: ParserResult;
    public readonly data: T;

    public constructor(
        filePath: string,
        kind: string,
        parserResult: ParserResult,
        data: T) {
        this.filePath = filePath;
        this.kind = kind;
        this.parserResult = parserResult;
        this.data = data;
    }
}