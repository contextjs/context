/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ParserContext } from "../../context/parser-context.js";
import { DiagnosticMessages } from "../../diagnostics/diagnostic-messages.js";
import { SyntaxNode } from "../../syntax/abstracts/syntax-node.js";
import { EndOfFileSyntaxNode } from "../../syntax/common/end-of-file-syntax-node.js";
import { StyleAttributeNameSyntaxNode } from "../../syntax/html/style/style-attribute-name-syntax-node.js";
import { StyleContentSyntaxNode } from "../../syntax/html/style/style-content-syntax-node.js";
import { StyleTagEndSyntaxNode } from "../../syntax/html/style/style-tag-end-syntax-node.js";
import { StyleTagNameSyntaxNode } from "../../syntax/html/style/style-tag-name-syntax-node.js";
import { StyleTagStartSyntaxNode } from "../../syntax/html/style/style-tag-start-syntax-node.js";
import { StyleTagSyntaxNode } from "../../syntax/html/style/style-tag-syntax-node.js";
import { TriviaParser } from "../common/trivia.parser.js";
import { TagEndParser } from "../generic/tags/tag-end.parser.js";
import { TagStartParser } from "../generic/tags/tag-start.parser.js";
import { ContentParser } from "../generic/content.parser.js";

export class StyleParser {
    public static isStyleStart(context: ParserContext): boolean {
        return context.peekMultiple(6) === '<style';
    }

    public static parse(context: ParserContext): StyleTagSyntaxNode {
        const children: SyntaxNode[] = [];
        const tagStartResult = TagStartParser.parse(
            context,
            StyleTagStartSyntaxNode,
            StyleTagNameSyntaxNode,
            {
                attributeSyntaxNode: StyleAttributeNameSyntaxNode,
                attributeNameSyntaxNode: StyleAttributeNameSyntaxNode,
                attributeValueSyntaxNode: StyleAttributeNameSyntaxNode,
            }
        );

        children.push(tagStartResult.tagStartSyntaxNode);
        children.push(ContentParser.parse(context, StyleContentSyntaxNode, this.shouldContentStop));

        const isEndTagPresent = context.peekMultiple(8).toLowerCase() === "</style>";
        if (context.currentCharacter === EndOfFileSyntaxNode.endOfFile || !isEndTagPresent)
            context.addErrorDiagnostic(DiagnosticMessages.ExpectedEndStyleTag(context.currentCharacter));
        else
            children.push(TagEndParser.parse(context, tagStartResult.tagName, StyleTagNameSyntaxNode, StyleTagEndSyntaxNode));

        return new StyleTagSyntaxNode(children, null, TriviaParser.parse(context));
    }

    private static shouldContentStop(context: ParserContext): boolean {
        return context.currentCharacter === EndOfFileSyntaxNode.endOfFile || context.peekMultiple(8).toLowerCase() === "</style>";
    }
}