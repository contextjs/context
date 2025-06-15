/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ParserContext } from "../../../context/parser-context.js";
import { DiagnosticMessages } from "../../../diagnostics/diagnostic-messages.js";
import { AttributeNameSyntaxNode, AttributeNameSyntaxNodeConstructor } from "../../../syntax/abstracts/attributes/attribute-name-syntax-node.js";
import { AttributeSyntaxNode, AttributeSyntaxNodeConstructor } from "../../../syntax/abstracts/attributes/attribute-syntax-node.js";
import { AttributeValueSyntaxNode, AttributeValueSyntaxNodeConstructor } from "../../../syntax/abstracts/attributes/attribute-value-syntax-node.js";
import { SyntaxNode } from "../../../syntax/abstracts/syntax-node.js";
import { TagNameSyntaxNode, TagNameSyntaxNodeConstructor } from "../../../syntax/abstracts/tags/tag-name-syntax-node.js";
import { TagStartSyntaxNode, TagStartSyntaxNodeConstructor } from "../../../syntax/abstracts/tags/tag-start-syntax-node.js";
import { EndOfFileSyntaxNode } from "../../../syntax/common/end-of-file-syntax-node.js";
import { BracketParser } from "../../common/bracket.parser.js";
import { TriviaParser } from "../../common/trivia.parser.js";
import { AttributeParser } from "../attribute.parser.js";
import { NameParser } from "../name.parser.js";
import { TagParserBase } from "./tag-parser-base.js";

export class TagStartParser extends TagParserBase {
    public static parse<
        TTagStartSyntaxNode extends TagStartSyntaxNode,
        TTagNameSyntaxNode extends TagNameSyntaxNode,
        TAttributeSyntaxNode extends AttributeSyntaxNode,
        TAttributeNameSyntaxNode extends AttributeNameSyntaxNode,
        TAttributeValueSyntaxNode extends AttributeValueSyntaxNode>(
            context: ParserContext,
            tagStartSyntaxNode: TagStartSyntaxNodeConstructor<TTagStartSyntaxNode>,
            tagNameSyntaxNode: TagNameSyntaxNodeConstructor<TTagNameSyntaxNode>,
            attributeTag: {
                attributeSyntaxNode: AttributeSyntaxNodeConstructor<TAttributeSyntaxNode>,
                attributeNameSyntaxNode: AttributeNameSyntaxNodeConstructor<TAttributeNameSyntaxNode>,
                attributeValueSyntaxNode: AttributeValueSyntaxNodeConstructor<TAttributeValueSyntaxNode>
            }
        ): { tagName: string, selfClosing: boolean, tagStartSyntaxNode: TTagStartSyntaxNode } {

        let done = false;
        let selfClosing = false;
        const children: SyntaxNode[] = [];

        children.push(BracketParser.parse(context, "<"));
        const tagName = this.getTagName(context);
        children.push(NameParser.parse(context, tagNameSyntaxNode, super.tagNameStopPredicate));

        context.reset();

        while (!done) {
            if (context.peekMultiple(2) === "/>") {
                children.push(BracketParser.parse(context, "/>"));
                selfClosing = true;
                done = true;
                break;
            }
            if (context.currentCharacter === ">") {
                children.push(BracketParser.parse(context, ">"));
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

        return { tagName, selfClosing, tagStartSyntaxNode: new tagStartSyntaxNode(children, TriviaParser.parse(context)) };
    }
}