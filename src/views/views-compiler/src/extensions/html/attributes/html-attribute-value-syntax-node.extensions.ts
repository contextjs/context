/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { StringBuilder } from "@contextjs/text";
import { HtmlAttributeValueSyntaxNode } from "@contextjs/views-parser";
import { GeneratorContext } from "../../../models/generator-context.js";

declare module "@contextjs/views-parser" {
    export interface HtmlAttributeValueSyntaxNode {
        generate(context: GeneratorContext): void;
    }
}

HtmlAttributeValueSyntaxNode.prototype.generate = function (context: GeneratorContext): void {
    this.leadingTrivia?.generate(context);

    for (const node of this.children)
        node.generate(context);

    this.trailingTrivia?.generate(context);
}