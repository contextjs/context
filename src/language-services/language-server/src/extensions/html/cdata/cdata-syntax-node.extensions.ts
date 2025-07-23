/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { CDATASyntaxNode } from "@contextjs/views-parser";
import { CodeContext } from "../../../visitors/code/code-context.js";
import { SemanticTokenContext } from "../../../visitors/semantics/semantic-token-context.js";
import { StyleContext } from "../../../visitors/styles/style-context.js";

declare module "@contextjs/views-parser" {
    export interface CDATASyntaxNode {
        parseStyles(context: StyleContext): void;
        parseCode(context: CodeContext): void;
        parseSemantics(context: SemanticTokenContext): void;
    }
}

CDATASyntaxNode.prototype.parseStyles = function (context: StyleContext): void {
    this.leadingTrivia?.parseStyles(context);

    this.start?.parseStyles(context);
    this.content?.parseStyles(context);
    this.end?.parseStyles(context);

    this.trailingTrivia?.parseStyles(context);
}

CDATASyntaxNode.prototype.parseCode = function (context: CodeContext): void {
    this.leadingTrivia?.parseCode(context);

    this.start?.parseCode(context);
    this.content?.parseCode(context);
    this.end?.parseCode(context);

    this.trailingTrivia?.parseCode(context);
}

CDATASyntaxNode.prototype.parseSemantics = function (context: SemanticTokenContext): void {
    this.leadingTrivia?.parseSemantics(context);

    this.start?.parseSemantics(context);
    this.content?.parseSemantics(context);
    this.end?.parseSemantics(context);

    this.trailingTrivia?.parseSemantics(context);
}