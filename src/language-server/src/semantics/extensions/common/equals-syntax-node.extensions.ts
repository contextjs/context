/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { EqualsSyntaxNode } from "@contextjs/views-parser";
import { SemanticTokenContext } from "../../semantic-token-context.js";
import { SemanticTokenType } from "../../semantic-token-type.js";

declare module "@contextjs/views-parser" {
    export interface EqualsSyntaxNode {
        parseSemanticTokens(context: SemanticTokenContext): void;
    }
}

EqualsSyntaxNode.prototype.parseSemanticTokens = function (context: SemanticTokenContext): void {
    this.leadingTrivia?.parseSemanticTokens(context);

    context.createToken(this.location, SemanticTokenType.Equals);

    this.trailingTrivia?.parseSemanticTokens(context);
};