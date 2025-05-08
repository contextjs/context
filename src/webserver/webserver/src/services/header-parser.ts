/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { HeaderParseResult } from "../models/header-parser-result.js";

enum ParseState {
    None = 0,
    CR = 1,
    CRLF = 2,
    CRLFCR = 3,
    Done = 4
}

export class HeaderParser {
    private buffer: Buffer;
    private position = 0;
    private boundaryState = ParseState.None;
    private readonly maxSize: number;

    constructor(maxSize: number) {
        this.maxSize = maxSize;
        this.buffer = Buffer.allocUnsafe(maxSize);
    }

    public append(data: Buffer): HeaderParseResult {
        if (data.length === 0) return {};

        let cursor = 0;
        while (cursor < data.length) {
            const byte = data[cursor++];
            if (this.position < this.maxSize)
                this.buffer[this.position++] = byte;
            else {
                this.reset();
                return { overflow: true };
            }

            switch (this.boundaryState) {
                case ParseState.None:
                    this.boundaryState = byte === 0x0d ? ParseState.CR : ParseState.None;
                    break;
                case ParseState.CR:
                    this.boundaryState = byte === 0x0a ? ParseState.CRLF : byte === 0x0d ? ParseState.CR : ParseState.None;
                    break;
                case ParseState.CRLF:
                    this.boundaryState = byte === 0x0d ? ParseState.CRLFCR : ParseState.None;
                    break;
                case ParseState.CRLFCR:
                    this.boundaryState = byte === 0x0a ? ParseState.Done : byte === 0x0d ? ParseState.CR : ParseState.None;
                    break;
            }

            if (this.boundaryState === ParseState.Done) {
                const header = this.buffer.subarray(0, this.position);
                const remaining = data.subarray(cursor);
                this.reset();

                return { header, remaining };
            }
        }

        return {};
    }

    private reset(): void {
        this.position = 0;
        this.boundaryState = ParseState.None;
    }
}