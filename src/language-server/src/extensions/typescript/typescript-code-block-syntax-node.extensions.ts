/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { TypescriptCodeBlockSyntaxNode } from "@contextjs/views-parser";
import { LanguageContext } from "../../visitors/languages/language-context.js";
import { SemanticTokenContext } from "../../visitors/semantics/semantic-token-context.js";

declare module "@contextjs/views-parser" {
    export interface TypescriptCodeBlockSyntaxNode {
        parseSemanticTokens(context: SemanticTokenContext): void;
        parseLanguage(context: LanguageContext): void;
    }
}

TypescriptCodeBlockSyntaxNode.prototype.parseSemanticTokens = function (context: SemanticTokenContext): void {
    this.leadingTrivia?.parseSemanticTokens(context);

    this.transition.parseSemanticTokens(context);
    this.openingBrace.parseSemanticTokens(context);

    for (const node of this.children)
        node.parseSemanticTokens(context);

    this.closingBrace.parseSemanticTokens(context);

    this.trailingTrivia?.parseSemanticTokens(context);
};

TypescriptCodeBlockSyntaxNode.prototype.parseLanguage = function (context: LanguageContext): void {
    this.languageService = context.tshtmlLanguageService;

    this.leadingTrivia?.parseLanguage(context);

    this.transition.parseLanguage(context);
    this.openingBrace.parseLanguage(context);

    for (const node of this.children)
        node.parseLanguage(context);

    this.closingBrace.parseLanguage(context);

    this.trailingTrivia?.parseLanguage(context);
};