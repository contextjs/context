/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-script license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ParserContext } from "../../context/parser-context.js";
import { DiagnosticMessages } from "../../diagnostics/diagnostic-messages.js";
import { SyntaxNode } from "../../syntax/abstracts/syntax-node.js";
import { EndOfFileSyntaxNode } from "../../syntax/common/end-of-file-syntax-node.js";
import { ScriptAttributeNameSyntaxNode } from "../../syntax/html/scripts/script-attribute-name-syntax-node.js";
import { ScriptContentSyntaxNode } from "../../syntax/html/scripts/script-content-syntax-node.js";
import { ScriptTagEndSyntaxNode } from "../../syntax/html/scripts/script-tag-end-syntax-node.js";
import { ScriptTagNameSyntaxNode } from "../../syntax/html/scripts/script-tag-name-syntax-node.js";
import { ScriptTagStartSyntaxNode } from "../../syntax/html/scripts/script-tag-start-syntax-node.js";
import { ScriptTagSyntaxNode } from "../../syntax/html/scripts/script-tag-syntax-node.js";
import { TriviaParser } from "../common/trivia.parser.js";
import { TagEndParser } from "../generic/tags/tag-end.parser.js";
import { TagStartParser } from "../generic/tags/tag-start.parser.js";
import { TokenParser } from "../generic/token.parser.js";

export class ScriptParser {
    public static isScriptStart(context: ParserContext): boolean {
        return context.peekMultiple(7) === '<script';
    }

    public static parse(context: ParserContext): ScriptTagSyntaxNode {
        const children: SyntaxNode[] = [];
        const tagStartResult = TagStartParser.parse(
            context,
            ScriptTagStartSyntaxNode,
            ScriptTagNameSyntaxNode,
            {
                attributeSyntaxNode: ScriptAttributeNameSyntaxNode,
                attributeNameSyntaxNode: ScriptAttributeNameSyntaxNode,
                attributeValueSyntaxNode: ScriptAttributeNameSyntaxNode,
            }
        );

        children.push(tagStartResult.tagStartSyntaxNode);
        children.push(TokenParser.parse(context, ScriptContentSyntaxNode, this.shouldContentStop));

        const isEndTagPresent = context.peekMultiple(9).toLowerCase() === "</script>";
        if (context.currentCharacter === EndOfFileSyntaxNode.endOfFile || !isEndTagPresent)
            context.addErrorDiagnostic(DiagnosticMessages.ExpectedEndScriptTag(context.currentCharacter));
        else
            children.push(TagEndParser.parse(context, tagStartResult.tagName, ScriptTagNameSyntaxNode, ScriptTagEndSyntaxNode));

        return new ScriptTagSyntaxNode(children, TriviaParser.parse(context));
    }

    private static shouldContentStop(context: ParserContext): boolean {
        return context.currentCharacter === EndOfFileSyntaxNode.endOfFile || context.peekMultiple(9).toLowerCase() === "</script>";
    }
}