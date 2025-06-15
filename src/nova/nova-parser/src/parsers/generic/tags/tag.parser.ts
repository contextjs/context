/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ParserContext } from "../../../context/parser-context.js";
import { AttributeNameSyntaxNode, AttributeNameSyntaxNodeConstructor } from "../../../syntax/abstracts/attributes/attribute-name-syntax-node.js";
import { AttributeSyntaxNode, AttributeSyntaxNodeConstructor } from "../../../syntax/abstracts/attributes/attribute-syntax-node.js";
import { AttributeValueSyntaxNode, AttributeValueSyntaxNodeConstructor } from "../../../syntax/abstracts/attributes/attribute-value-syntax-node.js";
import { SyntaxNode } from "../../../syntax/abstracts/syntax-node.js";
import { TagEndSyntaxNode, TagEndSyntaxNodeConstructor } from "../../../syntax/abstracts/tags/tag-end-syntax-node.js";
import { TagNameSyntaxNode, TagNameSyntaxNodeConstructor } from "../../../syntax/abstracts/tags/tag-name-syntax-node.js";
import { TagStartSyntaxNode, TagStartSyntaxNodeConstructor } from "../../../syntax/abstracts/tags/tag-start-syntax-node.js";
import { TagSyntaxNode, TagSyntaxNodeConstructor } from "../../../syntax/abstracts/tags/tag-syntax-node.js";
import { EndOfFileSyntaxNode } from "../../../syntax/common/end-of-file-syntax-node.js";
import { TriviaParser } from "../../common/trivia.parser.js";
import { TagEndParser } from "./tag-end.parser.js";
import { TagParserBase } from "./tag-parser-base.js";
import { TagStartParser } from "./tag-start.parser.js";

export class TagParser extends TagParserBase {
    public static parse<
        TTagSyntaxNode extends TagSyntaxNode,
        TTagNameSyntaxNode extends TagNameSyntaxNode,
        TTagStartSyntaxNode extends TagStartSyntaxNode,
        TTagEndSyntaxNode extends TagEndSyntaxNode,
        TAttributeSyntaxNode extends AttributeSyntaxNode,
        TAttributeNameSyntaxNode extends AttributeNameSyntaxNode,
        TAttributeValueSyntaxNode extends AttributeValueSyntaxNode>(
            context: ParserContext,
            tagSyntaxNode: TagSyntaxNodeConstructor<TTagSyntaxNode>,
            tagNameSyntaxNode: TagNameSyntaxNodeConstructor<TTagNameSyntaxNode>,
            tagStartSyntaxNode: TagStartSyntaxNodeConstructor<TTagStartSyntaxNode>,
            tagEndSyntaxNode: TagEndSyntaxNodeConstructor<TTagEndSyntaxNode>,
            attributeTag: {
                attributeSyntaxNode: AttributeSyntaxNodeConstructor<TAttributeSyntaxNode>,
                attributeNameSyntaxNode: AttributeNameSyntaxNodeConstructor<TAttributeNameSyntaxNode>,
                attributeValueSyntaxNode: AttributeValueSyntaxNodeConstructor<TAttributeValueSyntaxNode>
            }
        ): TagSyntaxNode {

        const children: SyntaxNode[] = [];
        const startTagResult = TagStartParser.parse(context, tagStartSyntaxNode, tagNameSyntaxNode, attributeTag);

        if (startTagResult.selfClosing)
            return new tagSyntaxNode([startTagResult.tagStartSyntaxNode], TriviaParser.parse(context));

        children.push(startTagResult.tagStartSyntaxNode);

        while (true) {
            if (context.currentCharacter === EndOfFileSyntaxNode.endOfFile)
                return new tagSyntaxNode(children, TriviaParser.parse(context));

            if (context.peekMultiple(2) === "</")
                break;

            children.push(context.parser.parse(context));
        }

        children.push(TagEndParser.parse(context, startTagResult.tagName, tagNameSyntaxNode, tagEndSyntaxNode));

        return new tagSyntaxNode(children, TriviaParser.parse(context));
    }

    public static override isValidTag(tagText: string): boolean {
        return super.isValidTag(tagText);
    }
}