/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { EndOfFileSyntaxNode } from "@contextjs/views-parser";
import { LanguageContext } from "../../visitors/languages/language-context.js";
import { SemanticTokenContext } from "../../visitors/semantics/semantic-token-context.js";

declare module "@contextjs/views-parser" {
    export interface EndOfFileSyntaxNode {
        parseSemanticTokens(context: SemanticTokenContext): void;
        parseLanguage(context: LanguageContext): void;
    }
}

EndOfFileSyntaxNode.prototype.parseSemanticTokens = function (context: SemanticTokenContext): void { }

EndOfFileSyntaxNode.prototype.parseLanguage = function (context: LanguageContext): void {
    this.languageService = context.htmlLanguageService;

    this.leadingTrivia?.parseLanguage(context);
};