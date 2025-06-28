/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import type { ISourceMapWriter } from "./interfaces/i-source-map-writer.js";

export class NoopSourceMapWriter implements ISourceMapWriter {
    addMapping(_params: {
        generated: { line: number; column: number };
        original: { line: number; column: number };
        source: string;
        name?: string;
    }): void { }
    setSourceContent(_sourceFile: string, _content: string): void { }
    toString(): string { return ""; }
}