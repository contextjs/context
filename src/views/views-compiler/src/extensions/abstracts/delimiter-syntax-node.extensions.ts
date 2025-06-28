/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { DelimiterSyntaxNode } from "@contextjs/views-parser";
import { GeneratorContext } from "../../models/generator-context.js";

declare module "@contextjs/views-parser" {
    export interface DelimiterSyntaxNode {
        generate(context: GeneratorContext): void;
    }
}

DelimiterSyntaxNode.prototype.generate = function (context: GeneratorContext): void { }