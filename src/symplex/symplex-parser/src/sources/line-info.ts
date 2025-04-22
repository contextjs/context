/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

export class LineInfo {
    public readonly lineIndex: number;
    public readonly startCharacterIndex: number;
    public readonly endCharacterIndex: number;

    constructor(lineIndex: number, startCharacterIndex: number, endCharacterIndex: number) {
        this.lineIndex = lineIndex;
        this.startCharacterIndex = startCharacterIndex;
        this.endCharacterIndex = endCharacterIndex;
    }
}