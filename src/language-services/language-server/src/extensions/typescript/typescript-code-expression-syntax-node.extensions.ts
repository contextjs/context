/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { TypescriptCodeExpressionSyntaxNode } from "@contextjs/views-parser";
import { CodeContext } from "../../visitors/code/code-context.js";
import { SemanticTokenContext } from "../../visitors/semantics/semantic-token-context.js";
import { StyleContext } from "../../visitors/styles/style-context.js";

declare module "@contextjs/views-parser" {
    export interface TypescriptCodeExpressionSyntaxNode {
        parseStyles(context: StyleContext): void;
        parseCode(context: CodeContext): void;
        parseSemantics(context: SemanticTokenContext): void;
    }
}

TypescriptCodeExpressionSyntaxNode.prototype.parseStyles = function (context: StyleContext): void {
    this.leadingTrivia?.parseStyles(context);

    this.transition.parseStyles(context);
    this.value.parseStyles(context);

    this.trailingTrivia?.parseStyles(context);
}

TypescriptCodeExpressionSyntaxNode.prototype.parseCode = function (context: CodeContext): void {
    this.leadingTrivia?.parseCode(context);

    this.transition.parseCode(context);
    this.value.parseCode(context);

    this.trailingTrivia?.parseCode(context);
}

TypescriptCodeExpressionSyntaxNode.prototype.parseSemantics = function (context: SemanticTokenContext): void {
    this.leadingTrivia?.parseSemantics(context);

    this.transition.parseSemantics(context);
    this.value.parseSemantics(context);

    this.trailingTrivia?.parseSemantics(context);
}