/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { StringExtensions } from "@contextjs/system";
import { CDATAContentSyntaxNode } from "@contextjs/views-parser";
import { GeneratorContext } from "../../../models/generator-context.js";

declare module "@contextjs/views-parser" {
    export interface CDATAContentSyntaxNode {
        generate(context: GeneratorContext): void;
    }
}

CDATAContentSyntaxNode.prototype.generate = function (context: GeneratorContext): void {
    this.leadingTrivia?.generate?.(context);

    if (this.value && this.value?.length > 0)
        context.appendToPendingLiteral(this.value, this);

    this.trailingTrivia?.generate?.(context);
};