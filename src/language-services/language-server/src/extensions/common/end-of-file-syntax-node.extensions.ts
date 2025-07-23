/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { EndOfFileSyntaxNode } from "@contextjs/views-parser";
import { CodeContext } from "../../visitors/code/code-context.js";
import { SemanticTokenContext } from "../../visitors/semantics/semantic-token-context.js";
import { StyleContext } from "../../visitors/styles/style-context.js";

declare module "@contextjs/views-parser" {
    export interface EndOfFileSyntaxNode {
        parseStyles(context: StyleContext): void;
        parseCode(context: CodeContext): void;
        parseSemantics(context: SemanticTokenContext): void;
    }
}

EndOfFileSyntaxNode.prototype.parseStyles = function (context: StyleContext): void {
    this.leadingTrivia?.parseStyles(context);

    context.parseStyles(this);
}

EndOfFileSyntaxNode.prototype.parseCode = function (context: CodeContext): void {
    this.leadingTrivia?.parseCode(context);

    context.parseCode(this);
}

EndOfFileSyntaxNode.prototype.parseSemantics = function (context: SemanticTokenContext): void { }