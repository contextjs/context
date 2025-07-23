/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { StyleAttributeNameSyntaxNode } from "@contextjs/views-parser";
import { SyntaxNodeType } from "../../../models/syntax-node-type.js";
import { CodeContext } from "../../../visitors/code/code-context.js";
import { SemanticTokenContext } from "../../../visitors/semantics/semantic-token-context.js";
import { StyleContext } from "../../../visitors/styles/style-context.js";

declare module "@contextjs/views-parser" {
    export interface StyleAttributeNameSyntaxNode {
        parseStyles(context: StyleContext): void;
        parseCode(context: CodeContext): void;
        parseSemantics(context: SemanticTokenContext): void;
    }
}

StyleAttributeNameSyntaxNode.prototype.parseStyles = function (context: StyleContext): void {
    this.leadingTrivia?.parseStyles(context);

    for (const node of this.children)
        node.parseStyles(context);

    this.trailingTrivia?.parseStyles(context);
}

StyleAttributeNameSyntaxNode.prototype.parseCode = function (context: CodeContext): void {
    this.leadingTrivia?.parseCode(context);

    for (const node of this.children)
        node.parseCode(context);

    this.trailingTrivia?.parseCode(context);
}

StyleAttributeNameSyntaxNode.prototype.parseSemantics = function (context: SemanticTokenContext): void {
    context.state.push(SyntaxNodeType.StyleAttributeName);
    this.leadingTrivia?.parseSemantics(context);

    for (const node of this.children)
        node.parseSemantics(context);

    this.trailingTrivia?.parseSemantics(context);
    context.state.pop();
}