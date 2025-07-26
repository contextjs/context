/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

export class ServerCompiledViewData {
    public readonly source: string;
    public readonly sourceMap: string | null;
    public readonly className: string;
    public readonly generatedFileName: string;

    public constructor(
        source: string,
        sourceMap: string | null,
        className: string,
        generatedFileName: string) {
        this.source = source;
        this.sourceMap = sourceMap;
        this.className = className;
        this.generatedFileName = generatedFileName;
    }
}