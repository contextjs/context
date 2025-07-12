/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { StyleContentSyntaxNode } from "@contextjs/views-parser";
import { SemanticTokenContext } from "../../../semantic-token-context.js";
import { SemanticTokenType } from "../../../semantic-token-type.js";

declare module "@contextjs/views-parser" {
    export interface StyleContentSyntaxNode {
        parseSemanticTokens(context: SemanticTokenContext): void;
    }
}

StyleContentSyntaxNode.prototype.parseSemanticTokens = function (context: SemanticTokenContext): void {
    this.leadingTrivia?.parseSemanticTokens(context);

    context.createToken(this.location, SemanticTokenType.StyleContent);

    this.trailingTrivia?.parseSemanticTokens(context);
};