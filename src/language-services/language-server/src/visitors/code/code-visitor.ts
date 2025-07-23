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
import { CodeContext } from "./code-context.js";

export class CodeVisitor implements INodeVisitor<CodeContext> {
    public context: CodeContext;

    public constructor(context: CodeContext) {
        this.context = context;
    }

    public static create(serverContext: ServerContext): CodeVisitor {
        serverContext.codeContext.reset();
        return new CodeVisitor(serverContext.codeContext);
    }

    public visit(node: SyntaxNode) {
        node.parseCode(this.context);
    }
}