/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { SyntaxNode } from "@contextjs/views-parser";
import { VisitorContext } from "../../models/visitor-context.js";
import { ILanguageService } from "../../services/languages/interfaces/i-language.service.js";
import { LanguageContext } from "../../visitors/languages/language-context.js";
import { SemanticTokenContext } from "../../visitors/semantics/semantic-token-context.js";
import { StyleContext } from "../../visitors/styles/style-context.js";

declare module "@contextjs/views-parser" {
    export interface SyntaxNode {
        languageService: ILanguageService;

        visit(context: VisitorContext): void;
        parseSemanticTokens(context: SemanticTokenContext): void;
        parseLanguage(context: LanguageContext): void;
        parseStyles(context: StyleContext): void;
    }
}

SyntaxNode.prototype.visit = function (context: VisitorContext): void {
    for (const visitor of context.visitors)
        visitor.visit(this);
}

SyntaxNode.prototype.parseStyles = function (context: StyleContext): void { };