/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { CommentSyntaxNode } from "@contextjs/views-parser";
import { SyntaxNodeType } from "../../models/syntax-node-type.js";
import { LanguageContext } from "../../visitors/languages/language-context.js";
import { SemanticTokenContext } from "../../visitors/semantics/semantic-token-context.js";

declare module "@contextjs/views-parser" {
    export interface CommentSyntaxNode {
        parseSemanticTokens(context: SemanticTokenContext): void;
        parseLanguage(context: LanguageContext): void;
    }
}

CommentSyntaxNode.prototype.parseSemanticTokens = function (context: SemanticTokenContext): void {
    this.leadingTrivia?.parseSemanticTokens(context);

    context.createToken(this.location, SyntaxNodeType.Comment);

    this.trailingTrivia?.parseSemanticTokens(context);
};

CommentSyntaxNode.prototype.parseLanguage = function (context: LanguageContext): void {
    this.languageService = context.htmlLanguageService;

    this.leadingTrivia?.parseLanguage(context);
    this.trailingTrivia?.parseLanguage(context);
};