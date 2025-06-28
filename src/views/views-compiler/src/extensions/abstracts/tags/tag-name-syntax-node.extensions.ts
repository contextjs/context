/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { TagNameSyntaxNode } from "@contextjs/views-parser";
import { GeneratorContext } from "../../../models/generator-context.js";

declare module "@contextjs/views-parser" {
    export interface TagNameSyntaxNode {
        generate(context: GeneratorContext): void;
    }
}

TagNameSyntaxNode.prototype.generate = function (context: GeneratorContext): void { }