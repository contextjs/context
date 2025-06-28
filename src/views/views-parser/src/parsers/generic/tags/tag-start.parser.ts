/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { DiagnosticMessages } from "@contextjs/views";
import { ParserContext } from "../../../context/parser-context.js";
import { AttributeNameSyntaxNode, AttributeNameSyntaxNodeConstructor } from "../../../syntax/abstracts/attributes/attribute-name-syntax-node.js";
import { AttributeSyntaxNode, AttributeSyntaxNodeConstructor } from "../../../syntax/abstracts/attributes/attribute-syntax-node.js";
import { AttributeValueSyntaxNode, AttributeValueSyntaxNodeConstructor } from "../../../syntax/abstracts/attributes/attribute-value-syntax-node.js";
import { BracketSyntaxNode, BracketSyntaxNodeConstructor } from "../../../syntax/abstracts/bracket-syntax-node.js";
import { SyntaxNode } from "../../../syntax/abstracts/syntax-node.js";
import { TagNameSyntaxNode, TagNameSyntaxNodeConstructor } from "../../../syntax/abstracts/tags/tag-name-syntax-node.js";
import { TagStartSyntaxNode, TagStartSyntaxNodeConstructor } from "../../../syntax/abstracts/tags/tag-start-syntax-node.js";
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
            tagStartSyntaxNode: TagStartSyntaxNodeConstructor<TTagStartSyntaxNode>,
            tagNameSyntaxNode: TagNameSyntaxNodeConstructor<TTagNameSyntaxNode>,
            attributeTag: {
                attributeSyntaxNode: AttributeSyntaxNodeConstructor<TAttributeSyntaxNode>,
                attributeNameSyntaxNode: AttributeNameSyntaxNodeConstructor<TAttributeNameSyntaxNode>,
                attributeValueSyntaxNode: AttributeValueSyntaxNodeConstructor<TAttributeValueSyntaxNode>
            },
            bracketSyntaxNode: BracketSyntaxNodeConstructor<TBracketSyntaxNode>
        ): { tagName: string, selfClosing: boolean, tagStartSyntaxNode: TTagStartSyntaxNode } {

        let done = false;
        let selfClosing = false;
        const children: SyntaxNode[] = [];

        children.push(BracketParser.parse(context, bracketSyntaxNode, "<"));
        const tagName = this.getTagName(context);
        children.push(NameParser.parse(context, tagNameSyntaxNode, super.tagNameStopPredicate));

        context.reset();

        while (!done) {
            if (context.currentCharacter === "<") {
                context.addErrorDiagnostic(DiagnosticMessages.InvalidTagFormat);
                done = true;
                break;
            }
            if (context.peekMultiple(2) === "/>") {
                children.push(BracketParser.parse(context, bracketSyntaxNode, "/>"));
                selfClosing = true;
                done = true;
                break;
            }
            if (context.currentCharacter === ">") {
                children.push(BracketParser.parse(context, bracketSyntaxNode, ">"));
                done = true;
                break;
            }
            if (context.currentCharacter === EndOfFileSyntaxNode.endOfFile) {
                context.addErrorDiagnostic(DiagnosticMessages.UnexpectedEndOfInput);
                done = true;
                break;
            }

            children.push(AttributeParser.parse(
                context,
                attributeTag.attributeSyntaxNode,
                attributeTag.attributeNameSyntaxNode,
                attributeTag.attributeValueSyntaxNode));
        }

        return { tagName, selfClosing, tagStartSyntaxNode: new tagStartSyntaxNode(children, null, TriviaParser.parse(context)) };
    }
}