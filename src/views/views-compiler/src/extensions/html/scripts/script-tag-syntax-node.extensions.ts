/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ScriptTagSyntaxNode } from "@contextjs/views-parser";
import { GeneratorState } from "../../../enums/generator-state.js";
import { ServerCodeGeneratorContext } from "../../../generators/server/server-code-generator-context.js";

declare module "@contextjs/views-parser" {
    export interface ScriptTagSyntaxNode {
        generateServerCode(context: ServerCodeGeneratorContext): void;
    }
}

ScriptTagSyntaxNode.prototype.generateServerCode = function (context: ServerCodeGeneratorContext): void {
    this.leadingTrivia?.generateServerCode?.(context);
    context.state.push(GeneratorState.InsideTag);

    for (const node of this.children)
        node.generateServerCode(context);

    context.state.pop();
    this.trailingTrivia?.generateServerCode?.(context);
}