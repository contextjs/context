/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { DiagnosticMessages } from "@contextjs/views";
import { ParserContext } from "../../context/parser-context.js";
import { SyntaxNode } from "../../syntax/abstracts/syntax-node.js";
import { EndOfFileSyntaxNode } from "../../syntax/common/end-of-file-syntax-node.js";
import { HtmlBracketSyntaxNode } from "../../syntax/html/html-bracket-syntax-node.js";
import { StyleAttributeNameSyntaxNode } from "../../syntax/html/style/style-attribute-name-syntax-node.js";
import { StyleAttributeSyntaxNode } from "../../syntax/html/style/style-attribute-syntax-node.js";
import { StyleAttributeValueSyntaxNode } from "../../syntax/html/style/style-attribute-value-syntax-node.js";
import { StyleContentSyntaxNode } from "../../syntax/html/style/style-content-syntax-node.js";
import { StyleTagEndSyntaxNode } from "../../syntax/html/style/style-tag-end-syntax-node.js";
import { StyleTagNameSyntaxNode } from "../../syntax/html/style/style-tag-name-syntax-node.js";
import { StyleTagStartSyntaxNode } from "../../syntax/html/style/style-tag-start-syntax-node.js";
import { StyleTagSyntaxNode } from "../../syntax/html/style/style-tag-syntax-node.js";
import { TriviaParser } from "../common/trivia.parser.js";
import { ContentParser } from "../generic/content.parser.js";
import { TagEndParser } from "../generic/tags/tag-end.parser.js";
import { TagStartParser } from "../generic/tags/tag-start.parser.js";

export class StyleParser {
    public static isStyleStart(context: ParserContext): boolean {
        return context.peekMultiple(6) === '<style';
    }

    public static parse(context: ParserContext): StyleTagSyntaxNode {
        const children: SyntaxNode[] = [];
        const tagStartResult = context.ensureProgress(
            () => TagStartParser.parse(
                context,
                (children, leadingTrivia, trailingTrivia) => new StyleTagStartSyntaxNode(children, leadingTrivia, trailingTrivia),
                (children, leadingTrivia, trailingTrivia) => new StyleTagNameSyntaxNode(children, leadingTrivia, trailingTrivia),
                {
                    attributeSyntaxNodeFactory: (children, leadingTrivia, trailingTrivia) => new StyleAttributeSyntaxNode(children, leadingTrivia, trailingTrivia),
                    attributeNameSyntaxNodeFactory: (children, leadingTrivia, trailingTrivia) => new StyleAttributeNameSyntaxNode(children, leadingTrivia, trailingTrivia),
                    attributeValueSyntaxNodeFactory: (attributeName, children, leadingTrivia, trailingTrivia) => new StyleAttributeValueSyntaxNode(attributeName, children, leadingTrivia, trailingTrivia),
                },
                (value, location, leadingTrivia, trailingTrivia) => new HtmlBracketSyntaxNode(value, location, leadingTrivia, trailingTrivia)
            ),
            'TagStartParser (style) did not advance context.'
        );

        children.push(tagStartResult.tagStartSyntaxNode);

        if(context.currentCharacter === EndOfFileSyntaxNode.endOfFile){
            context.addErrorDiagnostic(DiagnosticMessages.ExpectedEndStyleTag(context.currentCharacter));
            return new StyleTagSyntaxNode(children, null, TriviaParser.parse(context));
        }

        children.push(ContentParser.parse(
            context,
            (value, location, leadingTrivia, trailingTrivia) => new StyleContentSyntaxNode(value, location, leadingTrivia, trailingTrivia),
            this.shouldContentStop));

        const isEndTagPresent = context.peekMultiple(8).toLowerCase() === "</style>";
        if (context.currentCharacter === EndOfFileSyntaxNode.endOfFile || !isEndTagPresent)
            context.addErrorDiagnostic(DiagnosticMessages.ExpectedEndStyleTag(context.currentCharacter));
        else
            children.push(context.ensureProgress(
                () => TagEndParser.parse(
                    context,
                    tagStartResult.tagName,
                    (children, leadingTrivia, trailingTrivia) => new StyleTagNameSyntaxNode(children, leadingTrivia, trailingTrivia),
                    (children, leadingTrivia, trailingTrivia) => new StyleTagEndSyntaxNode(children, leadingTrivia, trailingTrivia),
                    (value, location, leadingTrivia, trailingTrivia) => new HtmlBracketSyntaxNode(value, location, leadingTrivia, trailingTrivia)),
                'TagEndParser (style end) did not advance context.'
            ));

        return new StyleTagSyntaxNode(children, null, TriviaParser.parse(context));
    }

    private static shouldContentStop(context: ParserContext): boolean {
        return context.currentCharacter === EndOfFileSyntaxNode.endOfFile || context.peekMultiple(8).toLowerCase() === "</style>";
    }
}