/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { DiagnosticMessages } from "@contextjs/views";
import { ParserContext } from "../../../context/parser-context.js";
import { BracketSyntaxNode, BracketSyntaxNodeConstructor } from "../../../syntax/abstracts/bracket-syntax-node.js";
import { SyntaxNode } from "../../../syntax/abstracts/syntax-node.js";
import { TagEndSyntaxNode, TagEndSyntaxNodeConstructor } from "../../../syntax/abstracts/tags/tag-end-syntax-node.js";
import { TagNameSyntaxNode, TagNameSyntaxNodeConstructor } from "../../../syntax/abstracts/tags/tag-name-syntax-node.js";
import { TriviaParser } from "../../common/trivia.parser.js";
import { BracketParser } from "../bracket.parser.js";
import { NameParser } from "../name.parser.js";
import { TagParserBase } from "./tag-parser-base.js";

export class TagEndParser extends TagParserBase {
    public static parse<
        TTagNameSyntaxNode extends TagNameSyntaxNode,
        TTagEndSyntaxNode extends TagEndSyntaxNode,
        TBracketSyntaxNode extends BracketSyntaxNode>(
            context: ParserContext,
            expectedTagName: string,
            tagNameSyntaxNode: TagNameSyntaxNodeConstructor<TTagNameSyntaxNode>,
            tagEndSyntaxNode: TagEndSyntaxNodeConstructor<TTagEndSyntaxNode>,
            bracketSyntaxNode: BracketSyntaxNodeConstructor<TBracketSyntaxNode>
        ): TTagEndSyntaxNode {

        const children: SyntaxNode[] = [];
        children.push(BracketParser.parse(context, bracketSyntaxNode, "</"));

        const tagName = this.getTagName(context);
        const tagNameNode = NameParser.parse(context, tagNameSyntaxNode, super.tagNameStopPredicate);
        children.push(tagNameNode);

        if (context.currentCharacter === ">")
            children.push(BracketParser.parse(context, bracketSyntaxNode, ">"));
        else
            context.addErrorDiagnostic(DiagnosticMessages.UnterminatedTag(expectedTagName));

        if (tagName.toLowerCase() !== expectedTagName.toLowerCase())
            context.addErrorDiagnostic(DiagnosticMessages.MismatchedEndTag(expectedTagName, tagName));

        return new tagEndSyntaxNode(children, null, TriviaParser.parse(context));
    }
}