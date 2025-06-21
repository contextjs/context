/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { LineInfo } from "./line-info.js";

export class Location {
    public readonly startLineIndex: number;
    public readonly startCharacterIndex: number;
    public readonly endLineIndex: number;
    public readonly endCharacterIndex: number;
    public readonly text: string;
    public readonly lines: LineInfo[];

    constructor(
        startLineIndex: number,
        startCharacterIndex: number,
        endLineIndex: number,
        endCharacterIndex: number,
        text: string,
        lines: LineInfo[]) {
        this.startLineIndex = startLineIndex;
        this.startCharacterIndex = startCharacterIndex;
        this.endLineIndex = endLineIndex;
        this.endCharacterIndex = endCharacterIndex;
        this.text = text;
        this.lines = lines;
    }

    public toString(): string {
        if (this.startLineIndex === this.endLineIndex)
            if (this.startCharacterIndex === this.endCharacterIndex)
                return `Line ${this.startLineIndex + 1}, Column ${this.startCharacterIndex + 1}`;
            else
                return `Line ${this.startLineIndex + 1}, Columns ${this.startCharacterIndex + 1}-${this.endCharacterIndex + 1}`;
        return `Line ${this.startLineIndex + 1}, Column ${this.startCharacterIndex + 1} - Line ${this.endLineIndex + 1}, Column ${this.endCharacterIndex + 1}`;
    }
}