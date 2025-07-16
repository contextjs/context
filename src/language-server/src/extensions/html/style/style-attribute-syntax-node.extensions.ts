/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { StyleAttributeSyntaxNode } from "@contextjs/views-parser";
import { LanguageContext } from "../../../visitors/languages/language-context.js";
import { SemanticTokenContext } from "../../../visitors/semantics/semantic-token-context.js";
import { StyleContext } from "../../../visitors/styles/style-context.js";

declare module "@contextjs/views-parser" {
    export interface StyleAttributeSyntaxNode {
        parseSemanticTokens(context: SemanticTokenContext): void;
        parseLanguage(context: LanguageContext): void;
        parseStyles(context: StyleContext): void;
    }
}

StyleAttributeSyntaxNode.prototype.parseSemanticTokens = function (context: SemanticTokenContext): void {
    this.leadingTrivia?.parseSemanticTokens(context);

    for (const node of this.children)
        node.parseSemanticTokens(context);

    this.trailingTrivia?.parseSemanticTokens(context);
}

StyleAttributeSyntaxNode.prototype.parseLanguage = function (context: LanguageContext): void {
    this.languageService = context.htmlLanguageService;

    this.leadingTrivia?.parseLanguage(context);

    for (const node of this.children)
        node.parseLanguage(context);

    this.trailingTrivia?.parseLanguage(context);
};

StyleAttributeSyntaxNode.prototype.parseStyles = function (context: StyleContext): void {
    for (const node of this.children)
        node.parseStyles(context);
}