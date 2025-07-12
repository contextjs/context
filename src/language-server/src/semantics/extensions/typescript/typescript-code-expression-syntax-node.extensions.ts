/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { TypescriptCodeExpressionSyntaxNode } from "@contextjs/views-parser";
import { SemanticTokenContext } from "../../semantic-token-context.js";

declare module "@contextjs/views-parser" {
    export interface TypescriptCodeExpressionSyntaxNode {
        parseSemanticTokens(context: SemanticTokenContext): void;
    }
}

TypescriptCodeExpressionSyntaxNode.prototype.parseSemanticTokens = function (context: SemanticTokenContext): void {
    this.leadingTrivia?.parseSemanticTokens(context);

    this.transition.parseSemanticTokens(context);
    this.value.parseSemanticTokens(context);

    this.trailingTrivia?.parseSemanticTokens(context);
};