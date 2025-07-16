/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { StringExtensions } from "@contextjs/system";
import { DiagnosticMessages } from "@contextjs/views";
import { ParserContext } from "../../../context/parser-context.js";
import { BracketSyntaxNode, BracketSyntaxNodeFactory } from "../../../syntax/abstracts/bracket-syntax-node.js";
import { SyntaxNode } from "../../../syntax/abstracts/syntax-node.js";
import { TagEndSyntaxNode, TagEndSyntaxNodeFactory } from "../../../syntax/abstracts/tags/tag-end-syntax-node.js";
import { TagNameSyntaxNode, TagNameSyntaxNodeFactory } from "../../../syntax/abstracts/tags/tag-name-syntax-node.js";
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
            tagNameSyntaxNodeFactory: TagNameSyntaxNodeFactory<TTagNameSyntaxNode>,
            tagEndSyntaxNodeFactory: TagEndSyntaxNodeFactory<TTagEndSyntaxNode>,
            bracketSyntaxNodeFactory: BracketSyntaxNodeFactory<TBracketSyntaxNode>
        ): TTagEndSyntaxNode {

        const children: SyntaxNode[] = [];
        children.push(context.ensureProgress(
            () => BracketParser.parse(context, bracketSyntaxNodeFactory, "</"),
            "BracketParser (open tag end) did not advance context."
        ));

        const tagName = this.getTagName(context);
        if (StringExtensions.isNullOrWhitespace(tagName)) {
            context.addErrorDiagnostic(DiagnosticMessages.InvalidTagName(context.currentCharacter));
            return tagEndSyntaxNodeFactory(children, null, TriviaParser.parse(context));
        }

        children.push(context.ensureProgress(
            () => NameParser.parse(context, tagNameSyntaxNodeFactory, super.tagNameStopPredicate),
            'NameParser (tag end) did not advance context.'
        ));

        if (context.currentCharacter === ">") {
            children.push(context.ensureProgress(
                () => BracketParser.parse(context, bracketSyntaxNodeFactory, ">"),
                'BracketParser (close tag end) did not advance context.'
            ));
        }
        else
            context.addErrorDiagnostic(DiagnosticMessages.UnterminatedTag(expectedTagName));

        if (tagName.toLowerCase() !== expectedTagName.toLowerCase())
            context.addErrorDiagnostic(DiagnosticMessages.MismatchedEndTag(expectedTagName, tagName));

        return tagEndSyntaxNodeFactory(children, null, TriviaParser.parse(context));
    }
}