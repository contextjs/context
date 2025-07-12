/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { DoctypeSyntaxNode } from "@contextjs/views-parser";
import { SemanticTokenContext } from "../../semantic-token-context.js";
import { SemanticTokenType } from "../../semantic-token-type.js";

declare module "@contextjs/views-parser" {
    export interface DoctypeSyntaxNode {
        parseSemanticTokens(context: SemanticTokenContext): void;
    }
}

DoctypeSyntaxNode.prototype.parseSemanticTokens = function (context: SemanticTokenContext): void {
    this.leadingTrivia?.parseSemanticTokens(context);

    context.createToken(this.location, SemanticTokenType.HtmlDoctype);

    this.trailingTrivia?.parseSemanticTokens(context);
};