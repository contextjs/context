/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { SyntaxNode } from "@contextjs/views-parser";
import { INodeVisitor } from "../../models/i-node-visitor{t}.js";
import { ServerContext } from "../../models/server-context.js";
import { SemanticTokenContext } from "./semantic-token-context.js";

export class SemanticTokenVisitor implements INodeVisitor<SemanticTokenContext> {
    context: SemanticTokenContext;

    constructor(context: SemanticTokenContext) {
        this.context = context;
    }

    public static create(serverContext: ServerContext): SemanticTokenVisitor {
        serverContext.semanticTokensContext.reset();
        return new SemanticTokenVisitor(serverContext.semanticTokensContext);
    }

    public visit(node: SyntaxNode) {
        node.parseSemanticTokens(this.context);
    }
}