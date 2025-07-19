/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Exception, StringExtensions } from "@contextjs/system";
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
        const lines: LineInfo[] = [];
        let lineStart = 0, lineIndex = 0;

        for (let i = 0; i < this.content.length; i++) {
            const char = this.content[i];
            if (char === "\r" || char === "\n") {
                let nextIndex = i;
                if (char === "\r" && this.content[i + 1] === "\n")
                    nextIndex++;

                lines.push(new LineInfo(lineIndex++, lineStart, nextIndex + 1));

                i = nextIndex;
                lineStart = i + 1;
            }
        }
        if (lineStart < this.content.length || (this.content.length > 0 && (
            this.content[this.content.length - 1] === '\n' ||
            this.content[this.content.length - 1] === '\r')))
            lines.push(new LineInfo(lineIndex, lineStart, this.content.length));

        return lines;
    }

    public getLocation(startIndex: number, endIndex: number): Location {
        if (this.lines.length === 0)
            return new Location(0, 0, 0, 0, 0, 0, StringExtensions.empty, []);

        if (startIndex < 0 || startIndex > this.content.length)
            throw new Exception("startIndex is out of bounds");

        if (endIndex < 0 || endIndex > this.content.length)
            throw new Exception("endIndex is out of bounds");

        const findLineInfo = (index: number) => {
            if (index === this.content.length && this.lines.length > 0)
                return this.lines[this.lines.length - 1];

            return this.lines.find(line => line.startCharacterIndex <= index && index < line.endCharacterIndex) ?? null;
        };

        const startLineInfo = findLineInfo(startIndex);
        const endLineInfo = findLineInfo(endIndex);

        if (!startLineInfo || !endLineInfo)
            throw new Exception("Line not found for the given character index");

        const startLineIndex = startLineInfo.index;
        const endLineIndex = endLineInfo.index;

        const startCharacterIndex = startIndex - startLineInfo.startCharacterIndex;
        const endCharacterIndex = endIndex === this.content.length
            ? endLineInfo.endCharacterIndex - endLineInfo.startCharacterIndex
            : endIndex - endLineInfo.startCharacterIndex;

        const lines: LineInfo[] = [];
        for (let i = startLineIndex; i <= endLineIndex; i++) {
            if (i === startLineIndex && i === endLineIndex)
                lines.push(new LineInfo(i, startCharacterIndex, endCharacterIndex));
            else if (i === startLineIndex)
                lines.push(new LineInfo(i, startCharacterIndex, this.lines[i].endCharacterIndex - this.lines[i].startCharacterIndex));
            else if (i === endLineIndex)
                lines.push(new LineInfo(i, 0, endCharacterIndex));
            else
                lines.push(new LineInfo(i, 0, this.lines[i].endCharacterIndex - this.lines[i].startCharacterIndex));
        }

        return new Location(
            startLineIndex,
            startCharacterIndex,
            endLineIndex,
            endCharacterIndex,
            startIndex,
            endIndex,
            this.content.substring(startIndex, endIndex),
            lines);
    }
}