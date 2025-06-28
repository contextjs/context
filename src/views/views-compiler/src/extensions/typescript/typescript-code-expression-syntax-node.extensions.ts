/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { TypescriptCodeExpressionSyntaxNode } from "@contextjs/views-parser";
import { GeneratorContext } from "../../models/generator-context.js";

declare module "@contextjs/views-parser" {
    export interface TypescriptCodeExpressionSyntaxNode {
        generate(context: GeneratorContext): void;
    }
}

TypescriptCodeExpressionSyntaxNode.prototype.generate = function (context: GeneratorContext): void {
    this.leadingTrivia?.generate(context);

    this.transition.generate(context);
    this.value.generate(context);

    this.trailingTrivia?.generate(context);
};