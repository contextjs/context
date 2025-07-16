/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { StringBuilder } from "@contextjs/text";
import { ParserContext } from "../../../context/parser-context.js";
import { AttributeNameSyntaxNode, AttributeNameSyntaxNodeFactory } from "../../../syntax/abstracts/attributes/attribute-name-syntax-node.js";
import { AttributeSyntaxNode, AttributeSyntaxNodeFactory } from "../../../syntax/abstracts/attributes/attribute-syntax-node.js";
import { AttributeValueSyntaxNode, AttributeValueSyntaxNodeFactory } from "../../../syntax/abstracts/attributes/attribute-value-syntax-node.js";
import { BracketSyntaxNode, BracketSyntaxNodeFactory } from "../../../syntax/abstracts/bracket-syntax-node.js";
import { SyntaxNode } from "../../../syntax/abstracts/syntax-node.js";
import { TagEndSyntaxNode, TagEndSyntaxNodeFactory } from "../../../syntax/abstracts/tags/tag-end-syntax-node.js";
import { TagNameSyntaxNode, TagNameSyntaxNodeFactory } from "../../../syntax/abstracts/tags/tag-name-syntax-node.js";
import { TagStartSyntaxNode, TagStartSyntaxNodeFactory } from "../../../syntax/abstracts/tags/tag-start-syntax-node.js";
import { TagSyntaxNode, TagSyntaxNodeFactory } from "../../../syntax/abstracts/tags/tag-syntax-node.js";
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
        TAttributeValueSyntaxNode extends AttributeValueSyntaxNode,
        TBracketSyntaxNode extends BracketSyntaxNode>(
            context: ParserContext,
            shouldStopParsing: (context: ParserContext, tagName: string) => boolean,
            tagSyntaxNodeFactory: TagSyntaxNodeFactory<TTagSyntaxNode>,
            tagNameSyntaxNodeFactory: TagNameSyntaxNodeFactory<TTagNameSyntaxNode>,
            tagStartSyntaxNodeFactory: TagStartSyntaxNodeFactory<TTagStartSyntaxNode>,
            tagEndSyntaxNodeFactory: TagEndSyntaxNodeFactory<TTagEndSyntaxNode>,
            attributeTagFactory: {
                attributeSyntaxNodeFactory: AttributeSyntaxNodeFactory<TAttributeSyntaxNode>,
                attributeNameSyntaxNodeFactory: AttributeNameSyntaxNodeFactory<TAttributeNameSyntaxNode>,
                attributeValueSyntaxNodeFactory: AttributeValueSyntaxNodeFactory<TAttributeValueSyntaxNode>
            },
            bracketSyntaxNodeFactory: BracketSyntaxNodeFactory<TBracketSyntaxNode>
        ): TTagSyntaxNode {

        const children: SyntaxNode[] = [];
        const startTagResult = context.ensureProgress(
            () => TagStartParser.parse(
                context,
                tagStartSyntaxNodeFactory,
                tagNameSyntaxNodeFactory,
                attributeTagFactory,
                bracketSyntaxNodeFactory),
            'TagStartParser did not advance context.'
        );

        if (startTagResult.selfClosing || shouldStopParsing(context, startTagResult.tagName))
            return tagSyntaxNodeFactory([startTagResult.tagStartSyntaxNode], null, TriviaParser.parse(context));

        children.push(startTagResult.tagStartSyntaxNode);

        while (true) {
            if (context.currentCharacter === EndOfFileSyntaxNode.endOfFile)
                return tagSyntaxNodeFactory(children);

            if (context.peekMultiple(2) === "</")
                break;

            children.push(context.parser.parse(context));
        }

        children.push(context.ensureProgress(
            () => TagEndParser.parse(
                context,
                startTagResult.tagName,
                tagNameSyntaxNodeFactory,
                tagEndSyntaxNodeFactory,
                bracketSyntaxNodeFactory
            ),
            'TagEndParser did not advance context.'
        ));

        return tagSyntaxNodeFactory(children, null, TriviaParser.parse(context));
    }

    public static override isValidTag(tagText: string): boolean {
        return super.isValidTag(tagText);
    }
}