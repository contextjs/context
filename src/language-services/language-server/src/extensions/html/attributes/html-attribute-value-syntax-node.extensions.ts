/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { HtmlAttributeValueSyntaxNode } from "@contextjs/views-parser";
import { SyntaxNodeType } from "../../../models/syntax-node-type.js";
import { CodeContext } from "../../../visitors/code/code-context.js";
import { SemanticTokenContext } from "../../../visitors/semantics/semantic-token-context.js";
import { StyleContext } from "../../../visitors/styles/style-context.js";

declare module "@contextjs/views-parser" {
    export interface HtmlAttributeValueSyntaxNode {
        parseStyles(context: StyleContext): void;
        parseCode(context: CodeContext): void;
        parseSemantics(context: SemanticTokenContext): void;
    }
}

HtmlAttributeValueSyntaxNode.prototype.parseStyles = function (context: StyleContext): void {
    this.leadingTrivia?.parseStyles(context);

    for (const node of this.children)
        node.parseStyles(context);

    this.trailingTrivia?.parseStyles(context);
}

HtmlAttributeValueSyntaxNode.prototype.parseCode = function (context: CodeContext): void {
    this.leadingTrivia?.parseCode(context);

    for (const node of this.children)
        node.parseCode(context);

    this.trailingTrivia?.parseCode(context);
}

HtmlAttributeValueSyntaxNode.prototype.parseSemantics = function (context: SemanticTokenContext): void {
    context.state.push(SyntaxNodeType.HtmlAttributeValue);
    this.leadingTrivia?.parseSemantics(context);

    for (const node of this.children)
        node.parseSemantics(context);

    this.trailingTrivia?.parseSemantics(context);
    context.state.pop();
}