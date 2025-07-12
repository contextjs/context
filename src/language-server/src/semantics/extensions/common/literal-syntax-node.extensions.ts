/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { LiteralSyntaxNode } from "@contextjs/views-parser";
import { SemanticTokenContext } from "../../semantic-token-context.js";
import { SemanticTokenType } from "../../semantic-token-type.js";

declare module "@contextjs/views-parser" {
    export interface LiteralSyntaxNode {
        parseSemanticTokens(context: SemanticTokenContext): void;
    }
}

LiteralSyntaxNode.prototype.parseSemanticTokens = function (context: SemanticTokenContext): void {
    this.leadingTrivia?.parseSemanticTokens(context);

    if (context.stateStack.isEmpty)
        context.createToken(this.location, SemanticTokenType.Literal);
    else
        context.createToken(this.location, context.stateStack.current!);

    this.trailingTrivia?.parseSemanticTokens(context);
};