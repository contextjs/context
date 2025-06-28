/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { TypescriptCodeBlockSyntaxNode } from "@contextjs/views-parser";
import { GeneratorContext } from "../../models/generator-context.js";
import { GeneratorState } from "../../enums/generator-state.js";

declare module "@contextjs/views-parser" {
    export interface TypescriptCodeBlockSyntaxNode {
        generate(context: GeneratorContext): void;
    }
}

TypescriptCodeBlockSyntaxNode.prototype.generate = function (context: GeneratorContext): void {
    context.state.push(GeneratorState.InsideCodeBlock);

    this.leadingTrivia?.generate(context);
    this.transition.generate(context);
    this.openingBrace.generate(context);

    for (const node of this.children)
        node.generate(context);

    this.closingBrace.generate(context);
    this.trailingTrivia?.generate(context);
    
    context.state.pop();
};