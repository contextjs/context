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
import { StyleContext } from "./style-context.js";

export class StyleVisitor implements INodeVisitor<StyleContext> {
    public context: StyleContext;

    public constructor(context: StyleContext) {
        this.context = context;
    }

    public static create(serverContext: ServerContext): StyleVisitor {
        serverContext.styleContext.reset();
        return new StyleVisitor(serverContext.styleContext);
    }

    public visit(node: SyntaxNode) {
        node.parseStyles(this.context);
    }
}