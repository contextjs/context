/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { TypescriptCodeBlockSyntaxNode } from "@contextjs/views-parser";
import { GeneratorState } from "../../enums/generator-state.js";
import { ServerCodeGeneratorContext } from "../../generators/server/server-code-generator-context.js";

declare module "@contextjs/views-parser" {
    export interface TypescriptCodeBlockSyntaxNode {
        generateServerCode(context: ServerCodeGeneratorContext): void;
    }
}

TypescriptCodeBlockSyntaxNode.prototype.generateServerCode = function (context: ServerCodeGeneratorContext): void {
    context.state.push(GeneratorState.InsideCodeBlock);

    this.leadingTrivia?.generateServerCode(context);
    this.transition.generateServerCode(context);
    this.openingBrace.generateServerCode(context);

    for (const node of this.children)
        node.generateServerCode(context);

    this.closingBrace.generateServerCode(context);
    this.trailingTrivia?.generateServerCode(context);

    context.state.pop();
};