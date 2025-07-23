/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { TriviaSyntaxNode } from "@contextjs/views-parser";
import { CodeContext } from "../../visitors/code/code-context.js";
import { SemanticTokenContext } from "../../visitors/semantics/semantic-token-context.js";
import { StyleContext } from "../../visitors/styles/style-context.js";

declare module "@contextjs/views-parser" {
    export interface TriviaSyntaxNode {
        parseStyles(context: StyleContext): void;
        parseCode(context: CodeContext): void;
        parseSemantics(context: SemanticTokenContext): void;
    }
}


TriviaSyntaxNode.prototype.parseStyles = function (context: StyleContext): void {
    context.parseStyles(this);
}

TriviaSyntaxNode.prototype.parseCode = function (context: CodeContext): void {
    context.parseCode(this);
}

TriviaSyntaxNode.prototype.parseSemantics = function (context: SemanticTokenContext): void { }