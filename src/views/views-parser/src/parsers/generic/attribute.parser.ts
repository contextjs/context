/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { StringExtensions } from "@contextjs/system";
import { ParserContext } from "../../context/parser-context.js";
import { AttributeNameSyntaxNode, AttributeNameSyntaxNodeConstructor } from "../../syntax/abstracts/attributes/attribute-name-syntax-node.js";
import { AttributeSyntaxNode, AttributeSyntaxNodeConstructor } from "../../syntax/abstracts/attributes/attribute-syntax-node.js";
import { AttributeValueSyntaxNode, AttributeValueSyntaxNodeConstructor } from "../../syntax/abstracts/attributes/attribute-value-syntax-node.js";
import { SyntaxNode } from "../../syntax/abstracts/syntax-node.js";
import { EqualsParser } from "../common/equals.parser.js";
import { TriviaParser } from "../common/trivia.parser.js";
import { AttributeValueParser } from "./attribute-value.parser.js";
import { NameParser } from "./name.parser.js";

export class AttributeParser {
    public static parse<
        TAttributeSyntaxNode extends AttributeSyntaxNode,
        TAttributeNameSyntaxNode extends AttributeNameSyntaxNode,
        TAttributeValueSyntaxNode extends AttributeValueSyntaxNode>(
            context: ParserContext,
            attributeSyntaxNode: AttributeSyntaxNodeConstructor<TAttributeSyntaxNode>,
            attributeNameSyntaxNode: AttributeNameSyntaxNodeConstructor<TAttributeNameSyntaxNode>,
            attributeValueSyntaxNode: AttributeValueSyntaxNodeConstructor<TAttributeValueSyntaxNode>
        ): AttributeSyntaxNode {

        const children: SyntaxNode[] = [];

        children.push(NameParser.parse(context, attributeNameSyntaxNode, this.nameStopPredicate));

        context.reset();
        if (context.currentCharacter === EqualsParser.equalsCharacter) {
            children.push(EqualsParser.parse(context));
            children.push(AttributeValueParser.parse(context, attributeValueSyntaxNode));
        }

        return new attributeSyntaxNode(children, null, TriviaParser.parse(context));
    }

    private static nameStopPredicate(context: ParserContext): boolean {
        const stopChars = new Set(['=', '/', '>', '"', "'", "`"]);
        return stopChars.has(context.currentCharacter) || StringExtensions.containsOnlyWhitespace(context.currentCharacter);
    }
}