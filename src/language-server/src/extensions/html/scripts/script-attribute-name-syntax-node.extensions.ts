/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ScriptAttributeNameSyntaxNode } from "@contextjs/views-parser";
import { SyntaxNodeType } from "../../../models/syntax-node-type.js";
import { LanguageContext } from "../../../visitors/languages/language-context.js";
import { SemanticTokenContext } from "../../../visitors/semantics/semantic-token-context.js";

declare module "@contextjs/views-parser" {
    export interface ScriptAttributeNameSyntaxNode {
        parseSemanticTokens(context: SemanticTokenContext): void;
        parseLanguage(context: LanguageContext): void;
    }
}

ScriptAttributeNameSyntaxNode.prototype.parseSemanticTokens = function (context: SemanticTokenContext): void {
    context.state.push(SyntaxNodeType.ScriptAttributeName);
    this.leadingTrivia?.parseSemanticTokens(context);

    for (const node of this.children)
        node.parseSemanticTokens(context);

    this.trailingTrivia?.parseSemanticTokens(context);
    context.state.pop();
}

ScriptAttributeNameSyntaxNode.prototype.parseLanguage = function (context: LanguageContext): void {
    this.languageService = context.htmlLanguageService;

    this.leadingTrivia?.parseLanguage(context);

    for (const node of this.children)
        node.parseLanguage(context);

    this.trailingTrivia?.parseLanguage(context);
};