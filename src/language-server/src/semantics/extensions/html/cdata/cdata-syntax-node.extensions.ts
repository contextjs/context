/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { CDATASyntaxNode } from "@contextjs/views-parser";
import { SemanticTokenContext } from "../../../semantic-token-context.js";

declare module "@contextjs/views-parser" {
    export interface CDATASyntaxNode {
        parseSemanticTokens(context: SemanticTokenContext): void;
    }
}

CDATASyntaxNode.prototype.parseSemanticTokens = function (context: SemanticTokenContext): void {
    this.leadingTrivia?.parseSemanticTokens(context);

    this.start?.parseSemanticTokens(context);
    this.content?.parseSemanticTokens(context);
    this.end?.parseSemanticTokens(context);

    this.trailingTrivia?.parseSemanticTokens(context);
}