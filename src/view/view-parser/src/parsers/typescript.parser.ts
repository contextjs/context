/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { StringExtensions } from "@contextjs/system";
import { ContextState } from "../context/context-state.js";
import { ParserContext } from "../context/parser-context.js";
import { SyntaxNode } from "../syntax/abstracts/syntax-node.js";
import { EndOfFileSyntaxNode } from "../syntax/end-of-file-syntax-node.js";
import { BraceSyntaxNode } from "../syntax/tshtml/brace-syntax-node.js";
import { TransitionSyntaxNode } from "../syntax/tshtml/transition-syntax-node.js";
import { InlineTypescriptSyntaxNode } from "../syntax/typescript/inline-typescript-syntax-node.js";
import { TypescriptSyntaxNode } from "../syntax/typescript/typescript-syntax-node.js";
import { TypescriptValueSyntaxNode } from "../syntax/typescript/typescript-value-syntax-node.js";
import { CommentsParser } from "./comments.parser.js";
import { EmptyCharactersParser } from "./empty-characters.parser.js";
import { HtmlParser } from "./html/html.parser.js";
import { TSHTMLParser } from "./tshtml/tshtml.parser.js";

export class TypescriptParser {
    public static parse(context: ParserContext): SyntaxNode {
        if (context.nextCharacter === '{') {
            context.setState(ContextState.Code);
            return this.parseTypescript(context);
        }

        return this.parseInlineTypescript(context);
    }

    private static parseInlineTypescript(context: ParserContext): SyntaxNode {
        context.reset();
        const transitionSyntaxNode = new TransitionSyntaxNode(context.getLocation());
        context.moveNext(1);
        context.reset();

        let value = StringExtensions.empty;
        let done = false;

        while (!done) {
            switch (context.currentCharacter) {
                case EndOfFileSyntaxNode.endOfFile:
                    done = true;
                    break;
                case ' ':
                case '=':
                case '"':
                case "'":
                case '@':
                    if (TSHTMLParser.isEscapedTransition(context)) {
                        value += context.currentCharacter;
                        context.moveNext();
                    }
                    else
                        done = true;
                    break;
                case '>':
                    done = true;
                    break;
                case '<':
                    if (context.nextCharacter === '/')
                        done = true;
                    else {
                        value += context.currentCharacter;
                        context.moveNext();
                    }
                    break;
                case '/':
                    if (context.nextCharacter === '>' || CommentsParser.isTypescriptCommentStart(context))
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

        const valueSyntaxNode = new TypescriptValueSyntaxNode(value, context.getLocation());

        return new InlineTypescriptSyntaxNode(transitionSyntaxNode, valueSyntaxNode, EmptyCharactersParser.parse(context));
    }

    private static parseTypescript(context: ParserContext): SyntaxNode {
        let nodes: SyntaxNode[] = [];
        let value = '';
        let done = false;

        context.reset();
        context.moveNext(1);
        const transitionSyntaxNode = new TransitionSyntaxNode(context.getLocation());

        context.reset();
        context.moveNext(1);
        const openBraceSyntaxNode = new BraceSyntaxNode('{', context.getLocation(), EmptyCharactersParser.parse(context));

        context.reset();

        while (!done && !context.stopped) {
            switch (context.currentCharacter) {
                case EndOfFileSyntaxNode.endOfFile:
                    if (context.currentState === ContextState.Code)
                        context.addErrorDiagnostic("Unexpected end of file. Expecting '}'.");
                    else if (context.currentState === ContextState.CodeBlock)
                        context.addErrorDiagnostic("Unexpected end of file in code block. Expecting '}'.");
                    context.stopFurtherExecution();
                    break;
                case '}':
                    if (context.currentState === ContextState.Code)
                        done = true;
                    else
                        value += context.currentCharacter;
                    context.moveNext();
                    context.popState();
                    break;
                case '{':
                    context.setState(ContextState.CodeBlock);
                    value += context.currentCharacter;
                    context.moveNext();
                    break;
                case '<':
                    const htmlNodes = this.tryParseHtmlTemplate(context, value);
                    if (htmlNodes.length === 0) {
                        value += context.currentCharacter;
                        context.moveNext();
                    }
                    else {
                        nodes = nodes.concat(htmlNodes);
                        value = '';
                    }
                    break;
                default:
                    value += context.currentCharacter;
                    context.moveNext();
                    break;
            }
        }

        if (!StringExtensions.isNullOrEmpty(value))
            nodes.push(new TypescriptValueSyntaxNode(value, context.getLocation(), EmptyCharactersParser.parse(context)));

        context.reset();
        const closeBraceSyntaxNode = new BraceSyntaxNode('}', context.getLocation(), EmptyCharactersParser.parse(context));

        return new TypescriptSyntaxNode(
            transitionSyntaxNode,
            openBraceSyntaxNode,
            TSHTMLParser.createReturnSyntaxNode(nodes, null),
            closeBraceSyntaxNode,
            EmptyCharactersParser.parse(context));
    }

    private static tryParseHtmlTemplate(context: ParserContext, code: string): SyntaxNode[] {
        const value = context.peekUntil((char) => char === '>' || char === EndOfFileSyntaxNode.endOfFile);
        if (value && value.endsWith(">") && HtmlParser.isValidHtmlTag(value)) {
            const nodes: SyntaxNode[] = [];
            if (!StringExtensions.containsOnlyLineBreaksAndSpaces(code))
                nodes.push(new TypescriptValueSyntaxNode(code, context.getLocation(), EmptyCharactersParser.parse(context)));

            nodes.push(TSHTMLParser.parse(context));

            return nodes;
        }

        return [];
    }
}