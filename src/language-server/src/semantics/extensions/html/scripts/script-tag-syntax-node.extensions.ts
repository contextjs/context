/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ScriptTagSyntaxNode } from "@contextjs/views-parser";
import { SemanticTokenContext } from "../../../semantic-token-context.js";

declare module "@contextjs/views-parser" {
    export interface ScriptTagSyntaxNode {
        parseSemanticTokens(context: SemanticTokenContext): void;
    }
}

ScriptTagSyntaxNode.prototype.parseSemanticTokens = function (context: SemanticTokenContext): void {
    this.leadingTrivia?.parseSemanticTokens(context);

    for (const node of this.children)
        node.parseSemanticTokens(context);

    this.trailingTrivia?.parseSemanticTokens(context);
}