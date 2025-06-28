/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { StringExtensions } from "@contextjs/system";
import { TriviaSyntaxNode } from "@contextjs/views-parser";
import { GeneratorContext } from "../../models/generator-context.js";

declare module "@contextjs/views-parser" {
    export interface TriviaSyntaxNode {
        generate(context: GeneratorContext): void;
    }
}

TriviaSyntaxNode.prototype.generate = function (context: GeneratorContext): void {
    if (this.value && this.value.length > 0) {
        const outputLine = context.valueBuilder.outputLine;
        const outputColumn = context.valueBuilder.outputColumn;
        const escaped = StringExtensions.escape(this.value);

        context.valueBuilder.appendLine(`__out += "${escaped}";`);

        context.sourceMapWriter.addMapping({
            generated: { line: outputLine, column: outputColumn },
            original: {
                line: this.location.startLineIndex + 1,
                column: this.location.startCharacterIndex
            },
            source: context.filePath
        });
    }
};