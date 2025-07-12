/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { TagEndSyntaxNode } from "@contextjs/views-parser";
import { SemanticTokenContext } from "../../../semantic-token-context.js";

declare module "@contextjs/views-parser" {
    export interface TagEndSyntaxNode {
        parseSemanticTokens(context: SemanticTokenContext): void;
    }
}

TagEndSyntaxNode.prototype.parseSemanticTokens = function (context: SemanticTokenContext): void { }