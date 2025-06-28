/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { CDATASyntaxNode } from "@contextjs/views-parser";
import { GeneratorContext } from "../../../models/generator-context.js";

declare module "@contextjs/views-parser" {
    export interface CDATASyntaxNode {
        generate(context: GeneratorContext): void;
    }
}

CDATASyntaxNode.prototype.generate = function (context: GeneratorContext): void {
    this.leadingTrivia?.generate(context);

    this.start?.generate(context);
    this.content?.generate(context);
    this.end?.generate(context);

    this.trailingTrivia?.generate(context);
}