/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ParserResult } from "@contextjs/views-parser";

export class ServerCompiledViewData {
    public readonly source: string;
    public readonly sourceMap: string | null;
    public readonly className: string;
    public readonly generatedFileName: string;
    public readonly parserResult: ParserResult;

    public constructor(
        source: string,
        sourceMap: string | null,
        className: string,
        generatedFileName: string,
        parserResult: ParserResult) {
        this.source = source;
        this.sourceMap = sourceMap;
        this.className = className;
        this.generatedFileName = generatedFileName;
        this.parserResult = parserResult;
    }
}