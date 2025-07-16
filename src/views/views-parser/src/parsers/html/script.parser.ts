/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-script license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { DiagnosticMessages } from "@contextjs/views";
import { HtmlBracketSyntaxNode } from "../../api/index.js";
import { ParserContext } from "../../context/parser-context.js";
import { SyntaxNode } from "../../syntax/abstracts/syntax-node.js";
import { EndOfFileSyntaxNode } from "../../syntax/common/end-of-file-syntax-node.js";
import { HtmlAttributeValueSyntaxNode } from "../../syntax/html/attributes/html-attribute-value-syntax-node.js";
import { ScriptAttributeNameSyntaxNode } from "../../syntax/html/scripts/script-attribute-name-syntax-node.js";
import { ScriptAttributeSyntaxNode } from "../../syntax/html/scripts/script-attribute-syntax-node.js";
import { ScriptContentSyntaxNode } from "../../syntax/html/scripts/script-content-syntax-node.js";
import { ScriptTagEndSyntaxNode } from "../../syntax/html/scripts/script-tag-end-syntax-node.js";
import { ScriptTagNameSyntaxNode } from "../../syntax/html/scripts/script-tag-name-syntax-node.js";
import { ScriptTagStartSyntaxNode } from "../../syntax/html/scripts/script-tag-start-syntax-node.js";
import { ScriptTagSyntaxNode } from "../../syntax/html/scripts/script-tag-syntax-node.js";
import { TriviaParser } from "../common/trivia.parser.js";
import { ContentParser } from "../generic/content.parser.js";
import { TagEndParser } from "../generic/tags/tag-end.parser.js";
import { TagStartParser } from "../generic/tags/tag-start.parser.js";

export class ScriptParser {
    public static isScriptStart(context: ParserContext): boolean {
        return context.peekMultiple(7) === '<script';
    }

    public static parse(context: ParserContext): ScriptTagSyntaxNode {
        const children: SyntaxNode[] = [];
        const tagStartResult = context.ensureProgress(
            () => TagStartParser.parse(
                context,
                (children, leadingTrivia, trailingTrivia) => new ScriptTagStartSyntaxNode(children, leadingTrivia, trailingTrivia),
                (children, leadingTrivia, trailingTrivia) => new ScriptTagNameSyntaxNode(children, leadingTrivia, trailingTrivia),
                {
                    attributeSyntaxNodeFactory: (children, leadingTrivia, trailingTrivia) => new ScriptAttributeSyntaxNode(children, leadingTrivia, trailingTrivia),
                    attributeNameSyntaxNodeFactory: (children, leadingTrivia, trailingTrivia) => new ScriptAttributeNameSyntaxNode(children, leadingTrivia, trailingTrivia),
                    attributeValueSyntaxNodeFactory: (attributeName, children, leadingTrivia, trailingTrivia) => new HtmlAttributeValueSyntaxNode(attributeName, children, leadingTrivia, trailingTrivia),
                },
                (value, location, leadingTrivia, trailingTrivia) => new HtmlBracketSyntaxNode(value, location, leadingTrivia, trailingTrivia)
            ),
            'TagStartParser (script) did not advance context.'
        );

        children.push(tagStartResult.tagStartSyntaxNode);
        children.push(ContentParser.parse(
            context,
            (value, location, leadingTrivia, trailingTrivia) => new ScriptContentSyntaxNode(value, location, leadingTrivia, trailingTrivia),
            this.shouldContentStop));

        const isEndTagPresent = context.peekMultiple(9).toLowerCase() === "</script>";
        if (context.currentCharacter === EndOfFileSyntaxNode.endOfFile || !isEndTagPresent)
            context.addErrorDiagnostic(DiagnosticMessages.ExpectedEndScriptTag(context.currentCharacter));
        else
            children.push(context.ensureProgress(
                () => TagEndParser.parse(
                    context,
                    tagStartResult.tagName,
                    (children, leadingTrivia, trailingTrivia) => new ScriptTagNameSyntaxNode(children, leadingTrivia, trailingTrivia),
                    (children, leadingTrivia, trailingTrivia) => new ScriptTagEndSyntaxNode(children, leadingTrivia, trailingTrivia),
                    (value, location, leadingTrivia, trailingTrivia) => new HtmlBracketSyntaxNode(value, location, leadingTrivia, trailingTrivia)),
                'TagEndParser (script end) did not advance context.'
            ));

        return new ScriptTagSyntaxNode(children, null, TriviaParser.parse(context));
    }

    private static shouldContentStop(context: ParserContext): boolean {
        return context.currentCharacter === EndOfFileSyntaxNode.endOfFile || context.peekMultiple(9).toLowerCase() === "</script>";
    }
}