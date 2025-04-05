/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { StringExtensions } from "@contextjs/system";
import { ParserContext } from "../../context/parser-context.js";
import { SyntaxNode } from "../../syntax/abstracts/syntax-node.js";
import { EndOfFileSyntaxNode } from "../../syntax/end-of-file-syntax-node.js";
import { AttributeNameSyntaxNode } from "../../syntax/html/attributes/attribute-name-syntax-node.js";
import { AttributeSyntaxNode } from "../../syntax/html/attributes/attribute-syntax-node.js";
import { AttributeValueSyntaxNode } from "../../syntax/html/attributes/attribute-value-syntax-node.js";
import { HtmlQuoteSyntaxNode } from "../../syntax/html/html-quote-syntax-node.js";
import { StyleContentSyntaxNode } from "../../syntax/html/styles/style-content-syntax-node.js";
import { LiteralSyntaxNode } from "../../syntax/literal-syntax-node.js";
import { EmptyCharactersParser } from "../empty-characters.parser.js";
import { TSHTMLParser } from "../tshtml/tshtml.parser.js";
import { HtmlParser } from "./html.parser.js";

export class AttributesParser {
    public static parse(context: ParserContext): SyntaxNode[] {
        context.reset();
        const attributes: AttributeSyntaxNode[] = [];
        let done = false;

        while (!done && !context.stopped) {
            switch (context.currentCharacter) {
                case EndOfFileSyntaxNode.endOfFile:
                    context.addErrorDiagnostic('Unexpected end of file while parsing attributes.');
                    context.stopFurtherExecution();
                    break;
                case '/':
                    if (context.nextCharacter !== '>') {
                        context.addErrorDiagnostic('Expected closing tag character ">" after "/" while parsing attributes.');
                        context.stopFurtherExecution();
                    }
                    done = true;
                    break;
                case '>':
                    done = true;
                    break;
                case ' ':
                    context.moveNext();
                    break;
                default:
                    const attributeName = HtmlParser.getElementName(context);
                    const attributeSyntaxNode = new AttributeSyntaxNode(this.parseAttributeName(context), null, null, null);
                    this.parseAttributeValue(context, attributeSyntaxNode, attributeName);
                    attributes.push(attributeSyntaxNode);
                    if (context.stopped)
                        return attributes;
                    break;
            }
        }

        return attributes;
    }

    private static parseAttributeName(context: ParserContext): SyntaxNode {
        let done = false;
        let value = '';
        const index = context.currentPosition;
        let nodes: SyntaxNode[] = [];

        context.reset();

        while (!done && !context.stopped) {
            switch (context.currentCharacter) {
                case EndOfFileSyntaxNode.endOfFile:
                    context.addErrorDiagnostic(`Unexpected end of file while parsing HTML attribute name.`);
                    context.stopFurtherExecution();
                    break;
                case '@':
                    if (TSHTMLParser.isEscapedTransition(context)) {
                        value += context.currentCharacter;
                        context.moveNext();
                    }
                    else if (value.length > 0)
                        nodes.push(new AttributeNameSyntaxNode(value, context.getLocation(), EmptyCharactersParser.parse(context)));
                    nodes.push(TSHTMLParser.parse(context));
                    value = '';
                    break;
                case ' ':
                case '=':
                case '>':
                case '/':
                    done = true;
                    break;
                default:
                    value += context.currentCharacter;
                    context.moveNext();
                    break;
            }
        }

        if (!StringExtensions.isNullOrWhiteSpace(value))
            nodes.push(new AttributeNameSyntaxNode(value, context.source.getLocation(index, context.currentPosition - 1, value), EmptyCharactersParser.parse(context)));

        return TSHTMLParser.createReturnSyntaxNode(nodes, null);
    }

    private static parseAttributeValue(context: ParserContext, attributeSyntaxNode: AttributeSyntaxNode, attributeName: string): void {
        let quoteCharacter = null;
        let nodes: SyntaxNode[] = [];
        let value = "";
        let done = false;
        const index = context.currentPosition;

        context.reset();

        if (context.peek() === '=') {
            context.moveNext();
            attributeSyntaxNode.assignment = new LiteralSyntaxNode('=', context.getLocation(), EmptyCharactersParser.parse(context));
        }
        else
            return;

        if (context.currentCharacter === '"' || context.currentCharacter === "'") {
            quoteCharacter = context.currentCharacter;
            attributeSyntaxNode.startQuote = new HtmlQuoteSyntaxNode(quoteCharacter, context.getLocation());
            context.reset();
            context.moveNext();
        }

        while (!done && !context.stopped) {
            switch (context.currentCharacter) {
                case EndOfFileSyntaxNode.endOfFile:
                    context.addErrorDiagnostic(`Unexpected end of file while parsing attribute value.`);
                    context.stopFurtherExecution();
                    break;
                case '@':
                    if (TSHTMLParser.isEscapedTransition(context)) {
                        value += context.currentCharacter;
                        context.moveNext();
                    }
                    else if (value.length > 0) {
                        context.addErrorDiagnosticForCurrentCharacter(`Unexpected character '@' while parsing attribute value.`);
                        context.stopFurtherExecution();
                    }
                    else
                        nodes.push(TSHTMLParser.parse(context));
                    break;
                case ' ':
                    if (quoteCharacter) {
                        value += context.currentCharacter;
                        context.moveNext();
                    }
                    else
                        done = true;
                    break;
                case '/':
                    if (quoteCharacter) {
                        value += context.currentCharacter;
                        context.moveNext();
                    }
                    else if (context.nextCharacter === '>')
                        done = true;
                    break;
                case '>':
                    if (quoteCharacter) {
                        context.addErrorDiagnostic(`Expected closing quote character '${quoteCharacter}' while parsing attribute value.`);
                        context.stopFurtherExecution();
                    }
                    done = true;
                    break;
                case quoteCharacter:
                    done = true;
                    break;
                default:
                    value += context.currentCharacter;
                    context.moveNext();
                    break;
            }
        }

        const location = context.source.getLocation(index, context.currentPosition - 1, value);

        if (quoteCharacter) {
            context.reset();
            context.moveNext();
            attributeSyntaxNode.endQuote = new HtmlQuoteSyntaxNode(quoteCharacter, context.getLocation());
        }

        attributeSyntaxNode.suffix = EmptyCharactersParser.parse(context);

        const node = StringExtensions.isNullOrWhiteSpace(value)
            ? null
            : attributeName === 'style'
                ? new StyleContentSyntaxNode(value, location)
                : new AttributeValueSyntaxNode(value, location);

        const attributeValueSyntaxNode = TSHTMLParser.createReturnSyntaxNode(nodes, node);
        attributeSyntaxNode.value = attributeValueSyntaxNode;
    }
}