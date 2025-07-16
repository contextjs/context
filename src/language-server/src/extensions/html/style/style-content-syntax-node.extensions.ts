/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { StyleContentSyntaxNode } from "@contextjs/views-parser";
import { SyntaxNodeType } from "../../../models/syntax-node-type.js";
import { LanguageContext } from "../../../visitors/languages/language-context.js";
import { SemanticTokenContext } from "../../../visitors/semantics/semantic-token-context.js";
import { StyleContext } from "../../../visitors/styles/style-context.js";

declare module "@contextjs/views-parser" {
    export interface StyleContentSyntaxNode {
        parseSemanticTokens(context: SemanticTokenContext): void;
        parseLanguage(context: LanguageContext): void;
        parseStyles(context: StyleContext): void;
    }
}

StyleContentSyntaxNode.prototype.parseSemanticTokens = function (context: SemanticTokenContext): void {
    this.leadingTrivia?.parseSemanticTokens(context);

    context.createToken(this.location, SyntaxNodeType.StyleContent);

    this.trailingTrivia?.parseSemanticTokens(context);
};

StyleContentSyntaxNode.prototype.parseLanguage = function (context: LanguageContext): void {
    this.languageService = context.cssLanguageService;

    this.leadingTrivia?.parseLanguage(context);
    this.trailingTrivia?.parseLanguage(context);
};

StyleContentSyntaxNode.prototype.parseStyles = function (context: StyleContext): void {
    context.setColors(this);
};