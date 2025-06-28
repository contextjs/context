/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import "./extensions/syntax-node-extension-imports.js";

import { GeneratorContext } from "./models/generator-context.js";

export class CodeGenerator {
    public static generate(context: GeneratorContext): string {
        context.valueBuilder.appendLine("let __out = \"\";");

        for (const node of context.parserResult.nodes)
            node.generate(context);

        context.valueBuilder.append("return __out;");

        return context.valueBuilder.toString();
    }
}