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
    public readonly length: number;
    public readonly type: number;
    public readonly modifiersBitset: number = 0;

    constructor(
        line: number,
        char: number,
        length: number,
        type: number) {
        this.line = line;
        this.char = char;
        this.length = length;
        this.type = type;
    }
}