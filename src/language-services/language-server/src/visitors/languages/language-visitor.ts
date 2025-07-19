/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import "../../extensions/abstracts/syntax-node.extensions.js";

import { SyntaxNode } from "@contextjs/views-parser";
import { INodeVisitor } from "../../models/i-node-visitor{t}.js";
import { ServerContext } from "../../models/server-context.js";
import { LanguageContext } from "./language-context.js";

export class LanguageVisitor implements INodeVisitor<LanguageContext> {
    public context: LanguageContext;

    public constructor(context: LanguageContext) {
        this.context = context;
    }

    public static create(serverContext: ServerContext): LanguageVisitor {
        serverContext.languageContext.reset();
        return new LanguageVisitor(serverContext.languageContext);
    }

    public visit(node: SyntaxNode) {
        node.parseLanguage(this.context);
    }
}