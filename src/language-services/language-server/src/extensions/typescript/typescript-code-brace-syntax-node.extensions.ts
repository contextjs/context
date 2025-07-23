/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { TypescriptCodeBraceSyntaxNode } from "@contextjs/views-parser";
import { SyntaxNodeType } from "../../models/syntax-node-type.js";
import { CodeContext } from "../../visitors/code/code-context.js";
import { SemanticTokenContext } from "../../visitors/semantics/semantic-token-context.js";
import { StyleContext } from "../../visitors/styles/style-context.js";

declare module "@contextjs/views-parser" {
    export interface TypescriptCodeBraceSyntaxNode {
        parseStyles(context: StyleContext): void;
        parseCode(context: CodeContext): void;
        parseSemantics(context: SemanticTokenContext): void;
    }
}

TypescriptCodeBraceSyntaxNode.prototype.parseStyles = function (context: StyleContext): void {
    this.leadingTrivia?.parseStyles(context);

    context.parseStyles(this);

    this.trailingTrivia?.parseStyles(context);
}

TypescriptCodeBraceSyntaxNode.prototype.parseCode = function (context: CodeContext): void {
    this.leadingTrivia?.parseCode(context);

    context.parseCode(this);

    this.trailingTrivia?.parseCode(context);
}

TypescriptCodeBraceSyntaxNode.prototype.parseSemantics = function (context: SemanticTokenContext): void {
    this.leadingTrivia?.parseSemantics(context);

    context.createToken(this, SyntaxNodeType.TypescriptCodeBrace);

    this.trailingTrivia?.parseSemantics(context);
}