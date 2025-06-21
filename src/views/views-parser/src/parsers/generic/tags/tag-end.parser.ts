/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ParserContext } from "../../../context/parser-context.js";
import { DiagnosticMessages } from "../../../diagnostics/diagnostic-messages.js";
import { SyntaxNode } from "../../../syntax/abstracts/syntax-node.js";
import { TagEndSyntaxNode, TagEndSyntaxNodeConstructor } from "../../../syntax/abstracts/tags/tag-end-syntax-node.js";
import { TagNameSyntaxNode, TagNameSyntaxNodeConstructor } from "../../../syntax/abstracts/tags/tag-name-syntax-node.js";
import { BracketParser } from "../../common/bracket.parser.js";
import { TriviaParser } from "../../common/trivia.parser.js";
import { NameParser } from "../name.parser.js";
import { TagParserBase } from "./tag-parser-base.js";

export class TagEndParser extends TagParserBase {
    public static parse<
        TTagNameSyntaxNode extends TagNameSyntaxNode,
        TTagEndSyntaxNode extends TagEndSyntaxNode>(
            context: ParserContext,
            expectedTagName: string,
            tagNameSyntaxNode: TagNameSyntaxNodeConstructor<TTagNameSyntaxNode>,
            tagEndSyntaxNode: TagEndSyntaxNodeConstructor<TTagEndSyntaxNode>
        ): TTagEndSyntaxNode {

        const children: SyntaxNode[] = [];
        children.push(BracketParser.parse(context, "</"));

        const tagName = this.getTagName(context);
        const tagNameNode = NameParser.parse(context, tagNameSyntaxNode, super.tagNameStopPredicate);
        children.push(tagNameNode);

        if (context.currentCharacter === ">")
            children.push(BracketParser.parse(context, ">"));
        else
            context.addErrorDiagnostic(DiagnosticMessages.UnterminatedTag(expectedTagName));

        if (tagName.toLowerCase() !== expectedTagName.toLowerCase())
            context.addErrorDiagnostic(DiagnosticMessages.MismatchedEndTag(expectedTagName, tagName));

        return new tagEndSyntaxNode(children, null, TriviaParser.parse(context));
    }
}