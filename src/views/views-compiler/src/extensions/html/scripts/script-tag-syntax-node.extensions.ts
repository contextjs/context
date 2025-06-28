/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ScriptTagSyntaxNode } from "@contextjs/views-parser";
import { GeneratorContext } from "../../../models/generator-context.js";
import { GeneratorState } from "../../../enums/generator-state.js";

declare module "@contextjs/views-parser" {
    export interface ScriptTagSyntaxNode {
        generate(context: GeneratorContext): void;
    }
}

ScriptTagSyntaxNode.prototype.generate = function (context: GeneratorContext): void {
    this.leadingTrivia?.generate(context);
    context.state.push(GeneratorState.InsideTag);
    
    for (const node of this.children)
        node.generate(context);

    context.state.pop();
    this.trailingTrivia?.generate(context);
}