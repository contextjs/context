/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ParserContext } from "../../context/parser-context.js";
import { SyntaxNode } from "../../syntax/abstracts/syntax-node.js";
import { CompositeSyntaxNode } from "../../syntax/composite-syntax-node.js";
import { EndOfFileSyntaxNode } from "../../syntax/end-of-file-syntax-node.js";
import { HtmlBracketSyntaxNode } from "../../syntax/html/html-bracket-syntax-node.js";
import { StyleContentSyntaxNode } from "../../syntax/html/styles/style-content-syntax-node.js";
import { StyleEndSyntaxNode } from "../../syntax/html/styles/style-end-syntax-node.js";
import { StyleStartSyntaxNode } from "../../syntax/html/styles/style-start-syntax-node.js";
import { StyleSyntaxNode } from "../../syntax/html/styles/style-syntax-node.js";
import { EmptyCharactersParser } from "../empty-characters.parser.js";
import { AttributesParser } from "./attributes.parser.js";

export class StyleParser {
    public static isStyleStart(context: ParserContext): boolean {
        return context.peekMultiple(6).toLowerCase() === '<style';
    }

    public static parse(context: ParserContext): SyntaxNode {
        let done = false;
        let value = '';

        context.reset();
        context.moveNext(1);
        const startOpenBracketSyntaxNode = new HtmlBracketSyntaxNode('<', context.getLocation());

        context.reset();
        if (context.peekMultiple(5).toLowerCase() !== 'style') {
            context.addErrorDiagnostic('Expected "style" after "<" in style tag start.');
            context.stopFurtherExecution();
            return startOpenBracketSyntaxNode;
        }

        context.moveNext(5);
        const startSyntaxNode = new StyleStartSyntaxNode('style', context.getLocation(), EmptyCharactersParser.parse(context));

        context.reset();
        const attributes = AttributesParser.parse(context);

        context.reset();
        if (context.currentCharacter !== '>') {
            context.addErrorDiagnostic('Expected ">" after style tag start.');
            context.stopFurtherExecution();
            return new CompositeSyntaxNode([startOpenBracketSyntaxNode, startSyntaxNode, ...attributes]);
        }
        context.moveNext(1);
        const startCloseBracketSyntaxNode = new HtmlBracketSyntaxNode('>', context.getLocation());

        context.reset();

        while (!done) {
            switch (context.currentCharacter) {
                case EndOfFileSyntaxNode.endOfFile:
                    context.addErrorDiagnostic('Unexpected end of file while parsing style tag.');
                    done = true;
                    break;
                default:
                    if (context.peekMultiple(8) === '</style>')
                        done = true;
                    else {
                        value += context.currentCharacter;
                        context.moveNext();
                    }
                    break;
            }
        }

        const styleContentSyntaxNode = new StyleContentSyntaxNode(value, context.getLocation(), EmptyCharactersParser.parse(context));

        context.reset();
        context.moveNext(2);
        const endOpenBracketSyntaxNode = new HtmlBracketSyntaxNode('</', context.getLocation());

        context.reset();
        context.moveNext(5);
        const endSyntaxNode = new StyleEndSyntaxNode('style', context.getLocation(), EmptyCharactersParser.parse(context));

        context.reset();
        if (context.currentCharacter !== '>') {
            context.addErrorDiagnostic('Expected ">" after style tag end.');
            context.stopFurtherExecution();
            return new StyleSyntaxNode(
                new CompositeSyntaxNode([startOpenBracketSyntaxNode, startSyntaxNode, ...attributes, startCloseBracketSyntaxNode]),
                styleContentSyntaxNode,
                new CompositeSyntaxNode([endOpenBracketSyntaxNode, endSyntaxNode]), null);
        }
        context.moveNext(1);
        const endCloseBracketSyntaxNode = new HtmlBracketSyntaxNode('>', context.getLocation());

        const node = new StyleSyntaxNode(
            new CompositeSyntaxNode([startOpenBracketSyntaxNode, startSyntaxNode, ...attributes, startCloseBracketSyntaxNode]),
            styleContentSyntaxNode,
            new CompositeSyntaxNode([endOpenBracketSyntaxNode, endSyntaxNode, endCloseBracketSyntaxNode]),
            EmptyCharactersParser.parse(context));

        return node;
    }
}