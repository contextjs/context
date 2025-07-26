/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { LiteralSyntaxNode } from "@contextjs/views-parser";
import { ServerCodeGeneratorContext } from "../../generators/server/server-code-generator-context.js";

declare module "@contextjs/views-parser" {
    export interface LiteralSyntaxNode {
        generateServerCode(context: ServerCodeGeneratorContext): void;
    }
}

LiteralSyntaxNode.prototype.generateServerCode = function (context: ServerCodeGeneratorContext): void {
    this.leadingTrivia?.generateServerCode?.(context);

    if (this.value && this.value?.length > 0)
        context.appendToPendingLiteral(this.value, this);

    this.trailingTrivia?.generateServerCode?.(context);
};