/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ScriptTagStartSyntaxNode } from "@contextjs/views-parser";
import { ServerCodeGeneratorContext } from "../../../generators/server/server-code-generator-context.js";

declare module "@contextjs/views-parser" {
    export interface ScriptTagStartSyntaxNode {
        generateServerCode(context: ServerCodeGeneratorContext): void;
    }
}

ScriptTagStartSyntaxNode.prototype.generateServerCode = function (context: ServerCodeGeneratorContext): void {
    this.leadingTrivia?.generateServerCode?.(context);

    for (const node of this.children)
        node.generateServerCode(context);

    this.trailingTrivia?.generateServerCode?.(context);
}