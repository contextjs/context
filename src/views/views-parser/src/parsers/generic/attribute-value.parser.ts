/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { StringExtensions } from "@contextjs/system";
import { StringBuilder } from "@contextjs/text";
import { DiagnosticMessages } from "@contextjs/views";
import { ParserContext } from "../../context/parser-context.js";
import { AttributeValueSyntaxNode, AttributeValueSyntaxNodeFactory } from "../../syntax/abstracts/attributes/attribute-value-syntax-node.js";
import { SyntaxNode } from "../../syntax/abstracts/syntax-node.js";
import { EndOfFileSyntaxNode } from "../../syntax/common/end-of-file-syntax-node.js";
import { LiteralSyntaxNode } from "../../syntax/common/literal-syntax-node.js";
import { QuoteSyntaxNode } from "../../syntax/common/quote-syntax-node.js";
import { TransitionParser } from "../common/transition.parser.js";
import { TriviaParser } from "../common/trivia.parser.js";

const DEFAULT_QUOTES = new Set(['"', "'"]);
const ATTRIBUTE_VALUE_TERMINATORS = new Set(['=', '>', '"', "'", '`']);

export class AttributeValueParser {
    public static parse<TAttributeValueSyntaxNode extends AttributeValueSyntaxNode>(
        context: ParserContext,
        attributeName: string,
        attributeValueSyntaxNode: AttributeValueSyntaxNodeFactory<TAttributeValueSyntaxNode>
    ): TAttributeValueSyntaxNode {

        const valueBuilder = new StringBuilder();
        const children: SyntaxNode[] = [];
        let isQuoted = false;
        let quoteCharacter: string | null = null;

        const leadingTrivia = TriviaParser.parse(context);

        context.reset();

        if (DEFAULT_QUOTES.has(context.currentCharacter)) {
            quoteCharacter = context.currentCharacter;
            context.moveNext();
            const openingQuoteNode = new QuoteSyntaxNode(quoteCharacter, context.getLocation(), null, TriviaParser.parse(context));
            children.push(openingQuoteNode);
            isQuoted = true;
            context.reset();
        }

        let done = false;
        let terminatedByWhitespace = false;

        while (!done) {
            switch (context.currentCharacter) {
                case EndOfFileSyntaxNode.endOfFile:
                    if (isQuoted)
                        context.addErrorDiagnostic(DiagnosticMessages.UnterminatedAttributeValue);

                    if (valueBuilder.length > 0)
                        children.push(new LiteralSyntaxNode(valueBuilder.toString(), context.getLocation()));
                    else if (!isQuoted)
                        context.addErrorDiagnostic(DiagnosticMessages.EmptyAttributeValue);

                    return attributeValueSyntaxNode(attributeName, children, null, TriviaParser.parse(context));

                case '@':
                    if (TransitionParser.isEscapedTransition(context)) {
                        valueBuilder.append("@");
                        context.moveNext(2);
                    }
                    else {
                        if (valueBuilder.length > 0)
                            children.push(new LiteralSyntaxNode(valueBuilder.toString(), context.getLocation()));
                        children.push(context.parser.parse(context));
                        valueBuilder.clear();
                        context.reset();
                    }
                    break;
                case '\\':
                    valueBuilder.append(context.currentCharacter);
                    context.moveNext();

                    if (context.currentCharacter !== EndOfFileSyntaxNode.endOfFile) {
                        valueBuilder.append(context.currentCharacter);
                        context.moveNext();
                    }
                    else {
                        context.addErrorDiagnostic(DiagnosticMessages.UnexpectedEndOfInput);
                        done = true;
                    }
                    break;
                default:
                    if (isQuoted && context.currentCharacter === quoteCharacter)
                        done = true;
                    else if (!isQuoted &&
                        (StringExtensions.containsOnlyWhitespace(context.currentCharacter) || ATTRIBUTE_VALUE_TERMINATORS.has(context.currentCharacter))) {
                        terminatedByWhitespace = StringExtensions.containsOnlyWhitespace(context.currentCharacter);
                        done = true;
                    }
                    else {
                        valueBuilder.append(context.currentCharacter);
                        context.moveNext();
                    }
            }
        }

        if (valueBuilder.length > 0)
            children.push(new LiteralSyntaxNode(valueBuilder.toString(), context.getLocation()));
        else if (!isQuoted && !terminatedByWhitespace)
            context.addErrorDiagnostic(DiagnosticMessages.EmptyAttributeValue);

        if (isQuoted) {
            if (context.currentCharacter === quoteCharacter) {
                context.reset();
                context.moveNext();
                children.push(new QuoteSyntaxNode(quoteCharacter, context.getLocation()));
            }
            else
                context.addErrorDiagnostic(DiagnosticMessages.UnterminatedAttributeValue);
        }

        return attributeValueSyntaxNode(attributeName, children, leadingTrivia, TriviaParser.parse(context));
    }
}