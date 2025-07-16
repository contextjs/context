/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { StringExtensions } from "@contextjs/system";
import { DiagnosticMessages } from "@contextjs/views";
import { ParserContext } from "../../context/parser-context.js";
import { AttributeNameSyntaxNode, AttributeNameSyntaxNodeFactory } from "../../syntax/abstracts/attributes/attribute-name-syntax-node.js";
import { AttributeSyntaxNode, AttributeSyntaxNodeFactory } from "../../syntax/abstracts/attributes/attribute-syntax-node.js";
import { AttributeValueSyntaxNode, AttributeValueSyntaxNodeFactory } from "../../syntax/abstracts/attributes/attribute-value-syntax-node.js";
import { SyntaxNode } from "../../syntax/abstracts/syntax-node.js";
import { EndOfFileSyntaxNode } from "../../syntax/common/end-of-file-syntax-node.js";
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
            attributeSyntaxNodeFactory: AttributeSyntaxNodeFactory<TAttributeSyntaxNode>,
            attributeNameSyntaxNodeFactory: AttributeNameSyntaxNodeFactory<TAttributeNameSyntaxNode>,
            attributeValueSyntaxNodeFactory: AttributeValueSyntaxNodeFactory<TAttributeValueSyntaxNode>
        ): TAttributeSyntaxNode {

        const children: SyntaxNode[] = [];
        const attributeName = AttributeParser.getAttributeName(context);

        children.push(context.ensureProgress(
            () => NameParser.parse(context, attributeNameSyntaxNodeFactory, this.nameStopPredicate),
            'NameParser (attribute) did not advance context.'
        ));

        context.reset();
        if (context.currentCharacter === EqualsParser.equalsCharacter) {
            children.push(context.ensureProgress(
                () => EqualsParser.parse(context),
                'EqualsParser did not advance context.'
            ));

            children.push(context.ensureProgress(
                () => AttributeValueParser.parse(context, attributeName, attributeValueSyntaxNodeFactory),
                'AttributeValueParser did not advance context.'
            ));
        }

        return attributeSyntaxNodeFactory(children, null, TriviaParser.parse(context));
    }

    private static nameStopPredicate(context: ParserContext): boolean {
        const stopChars = new Set(['=', '/', '>', '"', "'", "`"]);
        return stopChars.has(context.currentCharacter) || StringExtensions.containsOnlyWhitespace(context.currentCharacter);
    }

    private static getAttributeName(context: ParserContext): string {
        const attributeName = context.peekWhile((char) =>
            char !== '=' &&
            !StringExtensions.containsOnlyWhitespace(char) &&
            char !== EndOfFileSyntaxNode.endOfFile
        );

        if (StringExtensions.isNullOrWhitespace(attributeName)) {
            context.addErrorDiagnostic(DiagnosticMessages.UnexpectedEndOfInput);
            return StringExtensions.empty;
        }

        return attributeName;
    }
}