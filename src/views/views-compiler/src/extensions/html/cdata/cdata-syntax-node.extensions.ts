/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { CDATASyntaxNode } from "@contextjs/views-parser";
import { ServerCodeGeneratorContext } from "../../../generators/server/server-code-generator-context.js";

declare module "@contextjs/views-parser" {
    export interface CDATASyntaxNode {
        generateServerCode(context: ServerCodeGeneratorContext): void;
    }
}

CDATASyntaxNode.prototype.generateServerCode = function (context: ServerCodeGeneratorContext): void {
    this.leadingTrivia?.generateServerCode?.(context);

    this.start?.generateServerCode?.(context);
    this.content?.generateServerCode?.(context);
    this.end?.generateServerCode?.(context);

    this.trailingTrivia?.generateServerCode?.(context);
}