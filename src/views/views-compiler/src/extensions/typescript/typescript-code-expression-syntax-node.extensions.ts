/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { TypescriptCodeExpressionSyntaxNode } from "@contextjs/views-parser";
import { ServerCodeGeneratorContext } from "../../generators/server/server-code-generator-context.js";

declare module "@contextjs/views-parser" {
    export interface TypescriptCodeExpressionSyntaxNode {
        generateServerCode(context: ServerCodeGeneratorContext): void;
    }
}

TypescriptCodeExpressionSyntaxNode.prototype.generateServerCode = function (context: ServerCodeGeneratorContext): void {
    this.leadingTrivia?.generateServerCode(context);

    this.transition.generateServerCode(context);
    this.value.generateServerCode(context);

    this.trailingTrivia?.generateServerCode(context);
};