/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { LocationSyntaxNode } from "@contextjs/views-parser";
import { SemanticTokenContext } from "../../semantic-token-context.js";

declare module "@contextjs/views-parser" {
    export interface LocationSyntaxNode {
        parseSemanticTokens(context: SemanticTokenContext): void;
    }
}

LocationSyntaxNode.prototype.parseSemanticTokens = function (context: SemanticTokenContext): void { }