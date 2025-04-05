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
import { CompositeSyntaxNode } from "../../syntax/composite-syntax-node.js";
import { EndOfFileSyntaxNode } from "../../syntax/end-of-file-syntax-node.js";
import { HtmlBracketSyntaxNode } from "../../syntax/html/html-bracket-syntax-node.js";
import { HtmlTagNameSyntaxNode } from "../../syntax/html/html-tag-name-syntax-node.js";
import { HtmlTagSyntaxNode } from "../../syntax/html/html-tag-syntax-node.js";
import { LiteralSyntaxNode } from "../../syntax/literal-syntax-node.js";
import { EmptyCharactersParser } from "../empty-characters.parser.js";
import { TSHTMLParser } from "../tshtml/tshtml.parser.js";
import { AttributesParser } from "./attributes.parser.js";

export class HtmlParser {
    public static parse(context: ParserContext): SyntaxNode {
        context.reset();

        if (context.peek() !== '<') {
            context.addErrorDiagnosticForCurrentCharacter(`Expected character '<' while parsing HTML tag.`);
            context.stopFurtherExecution();
            return new LiteralSyntaxNode(context.currentCharacter, context.getLocation());
        }

        if (context.peekMultiple(2) === '</') {
            context.moveNext();
            context.addErrorDiagnosticForCurrentCharacter(`Unexpected character '/' while parsing HTML tag.`);
            context.stopFurtherExecution();

            return new LiteralSyntaxNode('</', context.getLocation());
        }

        const htmlTagSyntaxNode = new HtmlTagSyntaxNode(null!, [], null, null);
        this.parserStartTag(context, htmlTagSyntaxNode);
        if (context.stopped || htmlTagSyntaxNode.selfClosing)
            return htmlTagSyntaxNode;

        htmlTagSyntaxNode.children.push(...this.parseChildren(context, htmlTagSyntaxNode));

        this.parseEndTag(context, htmlTagSyntaxNode);

        htmlTagSyntaxNode.suffix = EmptyCharactersParser.parse(context);

        return htmlTagSyntaxNode;
    }

    public static getElementName(context: ParserContext): string {
        const elementName = context.peekWhile((char) =>
            char !== '>' &&
            char !== '/' &&
            char !== ' ' &&
            char !== '=' &&
            char !== EndOfFileSyntaxNode.endOfFile);
        if (!elementName) {
            context.addErrorDiagnostic(`Unexpected end of file while parsing element.`);
            context.stopFurtherExecution();
            return '';
        }

        return elementName.toLowerCase();
    }

    private static parserStartTag(context: ParserContext, htmlTagSyntaxNode: HtmlTagSyntaxNode): void {
        context.reset();
        context.moveNext();
        const openBraceSyntaxNode = new HtmlBracketSyntaxNode('<', context.getLocation(), EmptyCharactersParser.parse(context));

        htmlTagSyntaxNode.name = this.getElementName(context);

        const tagNameSyntaxNode = this.parseTagName(context);
        if (context.stopped) {
            htmlTagSyntaxNode.startTag = tagNameSyntaxNode;
            return;
        }

        const attributes = AttributesParser.parse(context);

        const resultNode = new CompositeSyntaxNode([openBraceSyntaxNode, tagNameSyntaxNode, ...attributes]);
        htmlTagSyntaxNode.startTag = resultNode;

        if (context.peekMultiple(2) === '/>') {
            resultNode.children.push(new HtmlBracketSyntaxNode('/>', context.getLocation()));
            context.moveNext(2);
            resultNode.suffix = EmptyCharactersParser.parse(context);
            htmlTagSyntaxNode.selfClosing = true;
            return;
        }

        if (context.currentCharacter !== '>') {
            context.addErrorDiagnosticForCurrentCharacter(`Expected character '>' while parsing HTML tag.`);
            context.stopFurtherExecution();
            return;
        }

        resultNode.children.push(new HtmlBracketSyntaxNode('>', context.getLocation()));
        context.moveNext();
        resultNode.suffix = EmptyCharactersParser.parse(context);
    }

    private static parseEndTag(context: ParserContext, htmlTagSyntaxNode: HtmlTagSyntaxNode): void {
        context.reset();

        if (context.peekMultiple(2) !== '</') {
            context.addErrorDiagnosticForCurrentCharacter(`Expected character '</' while parsing HTML tag.`);
            context.stopFurtherExecution();
            return;
        }

        context.moveNext(2);
        const openBracketSyntaxNode = new HtmlBracketSyntaxNode('</', context.getLocation(), EmptyCharactersParser.parse(context));
        context.reset();

        const tagName = this.getElementName(context);
        if (tagName.toLowerCase() !== htmlTagSyntaxNode.name) {
            context.addErrorDiagnostic(`Expected closing tag for '${htmlTagSyntaxNode.name}' but found '${tagName}'.`);
            context.stopFurtherExecution();
            return;
        }

        const tagNameSyntaxNode = this.parseTagName(context);
        context.reset();

        const closingBracketSyntaxNode = new HtmlBracketSyntaxNode('>', context.getLocation(), EmptyCharactersParser.parse(context));
        context.moveNext();
        htmlTagSyntaxNode.endTag = new CompositeSyntaxNode([openBracketSyntaxNode, tagNameSyntaxNode, closingBracketSyntaxNode]);
    }

    private static parseTagName(context: ParserContext): SyntaxNode {
        let done = false;
        let value = '';
        const index = context.currentPosition;
        const nodes: SyntaxNode[] = [];

        while (!done && !context.stopped) {
            switch (context.currentCharacter) {
                case EndOfFileSyntaxNode.endOfFile:
                    context.addErrorDiagnostic('Unexpected end of file while parsing HTML tag name');
                    context.stopFurtherExecution();
                    break;
                case '<':
                    context.addErrorDiagnosticForCurrentCharacter(`Unexpected character '<' while parsing HTML tag name.`);
                    context.stopFurtherExecution();
                    break;
                case '=':
                    context.addErrorDiagnosticForCurrentCharacter(`Unexpected character '=' while parsing HTML tag name.`);
                    context.stopFurtherExecution();
                    break;
                case '@':
                    if (TSHTMLParser.isEscapedTransition(context)) {
                        value += context.currentCharacter;
                        context.moveNext();
                    }
                    else if (value.length > 0) {
                        value += context.currentCharacter;
                        context.moveNext();
                    }
                    else
                        nodes.push(TSHTMLParser.parse(context));
                    break;
                case ' ':
                case '>':
                    done = true;
                    break;
                case '/':
                    if (context.nextCharacter === '>')
                        done = true;
                    else {
                        value += context.currentCharacter;
                        context.moveNext();
                    }
                    break;
                default:
                    if (StringExtensions.isLineBreak(context.currentCharacter))
                        done = true;
                    else {
                        value += context.currentCharacter;
                        context.moveNext();
                    }
                    break;
            }
        }

        const node = StringExtensions.isNullOrWhiteSpace(value)
            ? null
            : new HtmlTagNameSyntaxNode(value, context.source.getLocation(index, context.currentPosition - 1, value), EmptyCharactersParser.parse(context));

        return TSHTMLParser.createReturnSyntaxNode(nodes, node);
    }


    private static parseChildren(context: ParserContext, htmlTagSyntaxNode: HtmlTagSyntaxNode): SyntaxNode[] {
        context.reset();
        const children = [];
        const parentTagNameLength = htmlTagSyntaxNode.name.length;
        let done = false;

        while (!done && !context.stopped) {
            switch (context.currentCharacter) {
                case EndOfFileSyntaxNode.endOfFile:
                    context.addErrorDiagnostic(`Unexpected end of file while parsing ${htmlTagSyntaxNode.name} tag content.`);
                    context.stopFurtherExecution();
                    break;
                default:
                    if (context.peekMultiple(parentTagNameLength + 3) === `</${htmlTagSyntaxNode.name}>`)
                        done = true;
                    else
                        children.push(TSHTMLParser.parse(context));
                    break;
            }
        }

        return children;
    }

    public static isValidHtmlTag(text: string): boolean {
        let index = 0;
        const textLength = text.length;

        while (index < textLength && /\s/.test(text[index]))
            index++;

        if (index >= textLength || text[index] !== '<')
            return false;

        index++;

        while (index < textLength && /\s/.test(text[index]))
            index++;

        if (index < textLength && text[index] === '/') {
            index++;
            let tagName = '';
            while (index < textLength && text[index] !== '>' && !/\s/.test(text[index])) {
                tagName += text[index];
                index++;
            }

            while (index < textLength && /\s/.test(text[index]))
                index++;

            if (index >= textLength || text[index] !== '>')
                return false;

            index++;

            while (index < textLength && /\s/.test(text[index]))
                index++;

            return index === textLength && tagName.length > 0;
        }

        let tagName = '';
        while (index < textLength && !/\s/.test(text[index]) && text[index] !== '>' && text[index] !== '/' && text[index].charCodeAt(0) >= 33) {
            tagName += text[index];
            index++;
        }

        if (tagName.length === 0)
            return false;

        let inQuote = false;
        let quoteChar = '';

        while (index < textLength) {
            const char = text[index];

            if (inQuote) {
                if (char === quoteChar)
                    inQuote = false;
            }
            else {
                if (char === '"' || char === "'") {
                    inQuote = true;
                    quoteChar = char;
                }
                else if (char === '/') {
                    if (index + 1 < textLength && text[index + 1] === '>')
                        index++;
                }
                else if (char === '>') {
                    index++;
                    break;
                }
                else if (char === '<')
                    return false;
            }
            index++;
        }

        if (index > textLength)
            return false;

        while (index < textLength && /\s/.test(text[index]))
            index++;

        return index === textLength;
    }
}