/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

export interface ISourceMapWriter {
    addMapping(params: {
        generated: { line: number; column: number };
        original: { line: number; column: number };
        source: string;
        name?: string;
    }): void;
    setSourceContent(sourceFile: string, content: string): void;
    toString(): string;
}
