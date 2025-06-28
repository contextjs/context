/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { StringExtensions } from "@contextjs/system";
import { HtmlBracketSyntaxNode } from "@contextjs/views-parser";
import { GeneratorContext } from "../../models/generator-context.js";

declare module "@contextjs/views-parser" {
    export interface HtmlBracketSyntaxNode {
        generate(context: GeneratorContext): void;
    }
}

HtmlBracketSyntaxNode.prototype.generate = function (context: GeneratorContext): void {
    this.leadingTrivia?.generate?.(context);

    if (!StringExtensions.isNullOrWhitespace(this.value)) {
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

    this.trailingTrivia?.generate?.(context);
};