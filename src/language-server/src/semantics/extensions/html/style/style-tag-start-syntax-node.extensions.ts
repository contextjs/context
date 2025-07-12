/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { StyleTagStartSyntaxNode } from "@contextjs/views-parser";
import { SemanticTokenContext } from "../../../semantic-token-context.js";
import { SemanticTokenType } from "../../../semantic-token-type.js";

declare module "@contextjs/views-parser" {
    export interface StyleTagStartSyntaxNode {
        parseSemanticTokens(context: SemanticTokenContext): void;
    }
}

StyleTagStartSyntaxNode.prototype.parseSemanticTokens = function (context: SemanticTokenContext): void {
    context.stateStack.push(SemanticTokenType.StyleTagStart);
    this.leadingTrivia?.parseSemanticTokens(context);

    for (const node of this.children)
        node.parseSemanticTokens(context);

    this.trailingTrivia?.parseSemanticTokens(context);
    context.stateStack.pop();
}