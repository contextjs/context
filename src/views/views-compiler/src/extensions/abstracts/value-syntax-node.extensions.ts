/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ValueSyntaxNode } from "@contextjs/views-parser";
import { GeneratorContext } from "../../models/generator-context.js";

declare module "@contextjs/views-parser" {
    export interface ValueSyntaxNode {
        generate(context: GeneratorContext): void;
    }
}

ValueSyntaxNode.prototype.generate = function (context: GeneratorContext): void { }