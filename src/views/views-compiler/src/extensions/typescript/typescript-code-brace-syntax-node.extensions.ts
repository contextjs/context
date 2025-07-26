/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { TypescriptCodeBraceSyntaxNode } from "@contextjs/views-parser";
import { ServerCodeGeneratorContext } from "../../generators/server/server-code-generator-context.js";

declare module "@contextjs/views-parser" {
    export interface TypescriptCodeBraceSyntaxNode {
        generateServerCode(context: ServerCodeGeneratorContext): void;
    }
}

TypescriptCodeBraceSyntaxNode.prototype.generateServerCode = function (context: ServerCodeGeneratorContext): void { }