/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Exception } from "@contextjs/system";
import { LineInfo } from './line-info.js';
import { Location } from "./location.js";

export class Source {
    public readonly content: string;
    public readonly lines: LineInfo[];

    public constructor(content: string) {
        this.content = content;
        this.lines = this.getLines();
    }

    private getLines(): LineInfo[] {
        const lineIndexes: LineInfo[] = [];
        let lineStartIndex = 0;
        let lineIndex = 0;

        for (let i = 0; i < this.content.length; i++) {
            const char = this.content[i];

            if (char === '\r' || char === '\n') {
                const lineEndIndex = char === '\r' && this.content[i + 1] === '\n' ? ++i : i;
                lineIndexes.push(new LineInfo(lineIndex++, lineStartIndex, lineEndIndex));
                lineStartIndex = i + 1;
            }
        }

        if (lineStartIndex <= this.content.length)
            lineIndexes.push(new LineInfo(lineIndex, lineStartIndex, this.content.length));

        return lineIndexes;
    }

    public getLocation(startIndex: number, endIndex: number, text: string): Location {
        if (endIndex > this.content.length + 1)
            throw new Exception("startIndex is out of bounds");

        let startlineInfo = this.lines.find((line) => line.startCharacterIndex <= startIndex && line.endCharacterIndex >= startIndex);
        let endlineInfo = endIndex === this.content.length
            ? this.lines[this.lines.length - 1]
            : this.lines.find((line) => line.startCharacterIndex <= endIndex && line.endCharacterIndex >= endIndex);
        if (!startlineInfo || !endlineInfo)
            throw new Exception("Line not found for the given character index");

        let startCharacterIndex = startIndex - startlineInfo.startCharacterIndex;
        let endCharacterIndex = endIndex - endlineInfo.startCharacterIndex;
        if (endlineInfo.lineIndex > 0 && endCharacterIndex == 0) {
            endlineInfo = this.lines[endlineInfo.lineIndex - 1];
            endCharacterIndex = endlineInfo.endCharacterIndex - endlineInfo.startCharacterIndex;
        }

        const lines: LineInfo[] = [];

        for (let i = startlineInfo.lineIndex; i <= endlineInfo.lineIndex; i++) {
            if (i === startlineInfo.lineIndex && i === endlineInfo.lineIndex)
                lines.push(new LineInfo(i, startCharacterIndex, endCharacterIndex));
            else if (i === startlineInfo.lineIndex)
                lines.push(new LineInfo(i, startCharacterIndex, this.lines[i].endCharacterIndex - this.lines[i].startCharacterIndex));
            else if (i === endlineInfo.lineIndex)
                lines.push(new LineInfo(i, 0, endCharacterIndex));
            else
                lines.push(new LineInfo(i, 0, this.lines[i].endCharacterIndex - this.lines[i].startCharacterIndex));
        }

        return new Location(startlineInfo.lineIndex, startCharacterIndex, endlineInfo.lineIndex, endCharacterIndex, text, lines);
    }
}