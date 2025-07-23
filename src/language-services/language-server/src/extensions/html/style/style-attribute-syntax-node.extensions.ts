/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { StyleAttributeSyntaxNode } from "@contextjs/views-parser";
import { CodeContext } from "../../../visitors/code/code-context.js";
import { SemanticTokenContext } from "../../../visitors/semantics/semantic-token-context.js";
import { StyleContext } from "../../../visitors/styles/style-context.js";

declare module "@contextjs/views-parser" {
    export interface StyleAttributeSyntaxNode {
        parseStyles(context: StyleContext): void;
        parseCode(context: CodeContext): void;
        parseSemantics(context: SemanticTokenContext): void;
    }
}

StyleAttributeSyntaxNode.prototype.parseStyles = function (context: StyleContext): void {
    this.leadingTrivia?.parseStyles(context);

    for (const node of this.children)
        node.parseStyles(context);

    this.trailingTrivia?.parseStyles(context);
}

StyleAttributeSyntaxNode.prototype.parseCode = function (context: CodeContext): void {
    this.leadingTrivia?.parseCode(context);

    for (const node of this.children)
        node.parseCode(context);

    this.trailingTrivia?.parseCode(context);
}

StyleAttributeSyntaxNode.prototype.parseSemantics = function (context: SemanticTokenContext): void {
    this.leadingTrivia?.parseSemantics(context);

    for (const node of this.children)
        node.parseSemantics(context);

    this.trailingTrivia?.parseSemantics(context);
}