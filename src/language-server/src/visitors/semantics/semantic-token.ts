/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

export class SemanticToken {
    public readonly line: number;
    public readonly char: number;
    public readonly endChar: number;
    public readonly length: number;
    public readonly type: number;
    public readonly modifiersBitset: number = 0;
    public text: string;

    constructor(
        line: number,
        char: number,
        length: number,
        type: number,
        text: string,
        endChar: number) {
        this.line = line;
        this.char = char;
        this.length = length;
        this.type = type;
        this.text = text;
        this.endChar = endChar;
    }
}