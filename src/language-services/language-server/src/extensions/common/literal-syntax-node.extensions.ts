/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { LiteralSyntaxNode } from "@contextjs/views-parser";
import { SyntaxNodeType } from "../../models/syntax-node-type.js";
import { LanguageContext } from "../../visitors/languages/language-context.js";
import { SemanticTokenContext } from "../../visitors/semantics/semantic-token-context.js";
import { StyleContext } from "../../visitors/styles/style-context.js";

declare module "@contextjs/views-parser" {
    export interface LiteralSyntaxNode {
        parseSemanticTokens(context: SemanticTokenContext): void;
        parseLanguage(context: LanguageContext): void;
        parseStyles(context: StyleContext): void;
    }
}

LiteralSyntaxNode.prototype.parseSemanticTokens = function (context: SemanticTokenContext): void {
    this.leadingTrivia?.parseSemanticTokens(context);

    context.createToken(this.location, context.state.current ?? SyntaxNodeType.Literal);

    this.trailingTrivia?.parseSemanticTokens(context);
};

LiteralSyntaxNode.prototype.parseLanguage = function (context: LanguageContext): void {
    this.languageService = context.state.current === SyntaxNodeType.StyleAttributeValue
        ? context.cssLanguageService
        : context.htmlLanguageService;

    this.leadingTrivia?.parseLanguage(context);
    this.trailingTrivia?.parseLanguage(context);
};

LiteralSyntaxNode.prototype.parseStyles = function (context: StyleContext): void {
    this.leadingTrivia?.parseStyles(context);

    if (context.state.current === SyntaxNodeType.StyleAttributeValue) {
        context.setColors(this, true);
        context.buildCss(this, true);
    }
    else
        context.buildCss(this);

    this.trailingTrivia?.parseStyles(context);
};