/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { TriviaSyntaxNode } from "@contextjs/views-parser";
import { GeneratorContext } from "../../models/generator-context.js";

declare module "@contextjs/views-parser" {
    export interface TriviaSyntaxNode {
        generate(context: GeneratorContext): void;
    }
}

TriviaSyntaxNode.prototype.generate = function (context: GeneratorContext): void {
    if (this.value && this.value?.length > 0)
        context.appendToPendingLiteral(this.value, this);
};