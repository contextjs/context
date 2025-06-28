/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { StringExtensions } from "@contextjs/system";
import { TypescriptCodeValueSyntaxNode } from "@contextjs/views-parser";
import { GeneratorState } from "../../enums/generator-state.js";
import { GeneratorContext } from "../../models/generator-context.js";

declare module "@contextjs/views-parser" {
    export interface TypescriptCodeValueSyntaxNode {
        generate(context: GeneratorContext): void;
    }
}

TypescriptCodeValueSyntaxNode.prototype.generate = function (context: GeneratorContext): void {
    this.leadingTrivia?.generate?.(context);

    if (!StringExtensions.isNullOrWhitespace(this.value)) {
        const outputLine = context.valueBuilder.outputLine;
        const outputColumn = context.valueBuilder.outputColumn;

        if (context.state.current === GeneratorState.InsideTag)
            context.valueBuilder.appendLine(`__out += ${this.value};`);
        else
            context.valueBuilder.appendLine(this.value);

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