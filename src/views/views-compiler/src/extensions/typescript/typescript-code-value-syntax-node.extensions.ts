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
import { ServerCodeGeneratorContext } from "../../generators/server/server-code-generator-context.js";

declare module "@contextjs/views-parser" {
    export interface TypescriptCodeValueSyntaxNode {
        generateServerCode(context: ServerCodeGeneratorContext): void;
    }
}

TypescriptCodeValueSyntaxNode.prototype.generateServerCode = function (context: ServerCodeGeneratorContext): void {
    this.leadingTrivia?.generateServerCode(context);

    if (!StringExtensions.isNullOrWhitespace(this.value)) {
        context.flushPendingLiteral();

        if (context.state.current === GeneratorState.InsideTag)
            context.valueBuilder.appendLine(`        this.write(${this.value});`);
        else
            context.valueBuilder.appendLine(`        ${this.value}`);

        context.sourceMapWriter.addMapping({
            generated: { line: context.valueBuilder.outputLine, column: context.valueBuilder.outputColumn },
            original: {
                line: this.location.startLineIndex + 1,
                column: this.location.startCharacterIndex
            },
            source: context.filePath
        });
    }

    this.trailingTrivia?.generateServerCode(context);
};