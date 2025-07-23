/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

export class LineInfo {
    public readonly index: number;
    public readonly startCharacterIndex: number;
    public readonly endCharacterIndex: number;
    public readonly text: string;

    constructor(index: number, startCharacterIndex: number, endCharacterIndex: number, text: string) {
        this.index = index;
        this.startCharacterIndex = startCharacterIndex;
        this.endCharacterIndex = endCharacterIndex;
        this.text = text;
    }
}