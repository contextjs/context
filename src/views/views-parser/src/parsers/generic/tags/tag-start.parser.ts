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
import { AttributeNameSyntaxNode, AttributeNameSyntaxNodeFactory } from "../../../syntax/abstracts/attributes/attribute-name-syntax-node.js";
import { AttributeSyntaxNode, AttributeSyntaxNodeFactory } from "../../../syntax/abstracts/attributes/attribute-syntax-node.js";
import { AttributeValueSyntaxNode, AttributeValueSyntaxNodeFactory } from "../../../syntax/abstracts/attributes/attribute-value-syntax-node.js";
import { BracketSyntaxNode, BracketSyntaxNodeFactory } from "../../../syntax/abstracts/bracket-syntax-node.js";
import { SyntaxNode } from "../../../syntax/abstracts/syntax-node.js";
import { TagNameSyntaxNode, TagNameSyntaxNodeFactory } from "../../../syntax/abstracts/tags/tag-name-syntax-node.js";
import { TagStartSyntaxNode, TagStartSyntaxNodeFactory } from "../../../syntax/abstracts/tags/tag-start-syntax-node.js";
import { EndOfFileSyntaxNode } from "../../../syntax/common/end-of-file-syntax-node.js";
import { TriviaParser } from "../../common/trivia.parser.js";
import { AttributeParser } from "../attribute.parser.js";
import { BracketParser } from "../bracket.parser.js";
import { NameParser } from "../name.parser.js";
import { TagParserBase } from "./tag-parser-base.js";

export class TagStartParser extends TagParserBase {
    public static parse<
        TTagStartSyntaxNode extends TagStartSyntaxNode,
        TTagNameSyntaxNode extends TagNameSyntaxNode,
        TAttributeSyntaxNode extends AttributeSyntaxNode,
        TAttributeNameSyntaxNode extends AttributeNameSyntaxNode,
        TAttributeValueSyntaxNode extends AttributeValueSyntaxNode,
        TBracketSyntaxNode extends BracketSyntaxNode>(
            context: ParserContext,
            tagStartSyntaxNodeFactory: TagStartSyntaxNodeFactory<TTagStartSyntaxNode>,
            tagNameSyntaxNodeFactory: TagNameSyntaxNodeFactory<TTagNameSyntaxNode>,
            attributeTagFactory: {
                attributeSyntaxNodeFactory: AttributeSyntaxNodeFactory<TAttributeSyntaxNode>,
                attributeNameSyntaxNodeFactory: AttributeNameSyntaxNodeFactory<TAttributeNameSyntaxNode>,
                attributeValueSyntaxNodeFactory: AttributeValueSyntaxNodeFactory<TAttributeValueSyntaxNode>
            },
            bracketSyntaxNodeFactory: BracketSyntaxNodeFactory<TBracketSyntaxNode>
        ): { tagName: string, selfClosing: boolean, tagStartSyntaxNode: TTagStartSyntaxNode } {

        let done = false;
        let selfClosing = false;
        const children: SyntaxNode[] = [];

        children.push(context.ensureProgress(
            () => BracketParser.parse(context, bracketSyntaxNodeFactory, "<"),
            'BracketParser (tag start "<") did not advance context.'
        ));

        const tagName = this.getTagName(context);
        if (StringExtensions.isNullOrWhitespace(tagName)) {
            context.addErrorDiagnostic(DiagnosticMessages.InvalidTagName(context.currentCharacter));
            return { tagName, selfClosing, tagStartSyntaxNode: tagStartSyntaxNodeFactory(children, null, TriviaParser.parse(context)) };
        }

        children.push(context.ensureProgress(
            () => NameParser.parse(context, tagNameSyntaxNodeFactory, super.tagNameStopPredicate),
            'NameParser (tag start) did not advance context.'
        ));

        context.reset();

        while (!done) {
            if (context.currentCharacter === "<") {
                context.addErrorDiagnostic(DiagnosticMessages.InvalidTagFormat);
                done = true;
                break;
            }
            if (context.peekMultiple(2) === "/>") {
                children.push(context.ensureProgress(
                    () => BracketParser.parse(context, bracketSyntaxNodeFactory, "/>"),
                    'BracketParser (tag start "/>") did not advance context.'
                ));
                selfClosing = true;
                done = true;
                break;
            }
            if (context.currentCharacter === ">") {
                children.push(context.ensureProgress(
                    () => BracketParser.parse(context, bracketSyntaxNodeFactory, ">"),
                    'BracketParser (tag start ">") did not advance context.'
                ));
                done = true;
                break;
            }
            if (context.currentCharacter === EndOfFileSyntaxNode.endOfFile) {
                context.addErrorDiagnostic(DiagnosticMessages.UnexpectedEndOfInput);
                done = true;
                break;
            }

            children.push(context.ensureProgress(
                () => AttributeParser.parse(
                    context,
                    attributeTagFactory.attributeSyntaxNodeFactory,
                    attributeTagFactory.attributeNameSyntaxNodeFactory,
                    attributeTagFactory.attributeValueSyntaxNodeFactory
                ),
                'AttributeParser did not advance context.'
            ));
        }

        return { tagName, selfClosing, tagStartSyntaxNode: tagStartSyntaxNodeFactory(children, null, TriviaParser.parse(context)) };
    }
}