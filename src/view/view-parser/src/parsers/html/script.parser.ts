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
import { ScriptContentSyntaxNode } from "../../syntax/html/scripts/script-content-syntax-node.js";
import { ScriptEndSyntaxNode } from "../../syntax/html/scripts/script-end-syntax-node.js";
import { ScriptStartSyntaxNode } from "../../syntax/html/scripts/script-start-syntax-node.js";
import { ScriptSyntaxNode } from "../../syntax/html/scripts/script-syntax-node.js";
import { EmptyCharactersParser } from "../empty-characters.parser.js";
import { AttributesParser } from "./attributes.parser.js";

export class ScriptParser {
    public static isScriptStart(context: ParserContext): boolean {
        return context.peekMultiple(7).toLowerCase() === '<script';
    }

    public static parse(context: ParserContext): SyntaxNode {
        let done = false;
        let value = '';

        context.reset();
        context.moveNext(1);
        const startOpenBracketSyntaxNode = new HtmlBracketSyntaxNode('<', context.getLocation());

        context.reset();
        if (context.peekMultiple(6).toLowerCase() !== 'script') {
            context.addErrorDiagnostic('Expected "script" after "<" in script tag start.');
            context.stopFurtherExecution();
            return startOpenBracketSyntaxNode;
        }

        context.moveNext(6);
        const startSyntaxNode = new ScriptStartSyntaxNode('script', context.getLocation(), EmptyCharactersParser.parse(context));

        context.reset();
        const attributes = AttributesParser.parse(context);

        context.reset();
        if (context.currentCharacter !== '>') {
            context.addErrorDiagnostic('Expected ">" after script tag start.');
            context.stopFurtherExecution();
            return new CompositeSyntaxNode([startOpenBracketSyntaxNode, startSyntaxNode, ...attributes]);
        }
        context.moveNext(1);
        const startCloseBracketSyntaxNode = new HtmlBracketSyntaxNode('>', context.getLocation());

        context.reset();

        while (!done) {
            switch (context.currentCharacter) {
                case EndOfFileSyntaxNode.endOfFile:
                    context.addErrorDiagnostic('Unexpected end of file while parsing "script" element.');
                    done = true;
                    break;
                default:
                    if (context.peekMultiple(9).toLowerCase() === '</script>') {
                        value += '</script>';
                        context.moveNext(9);
                        done = true;
                    } else {
                        value += context.currentCharacter;
                        context.moveNext();
                    }
                    break;
            }
        }

        const scriptContentSyntaxNode = new ScriptContentSyntaxNode(value, context.getLocation(), EmptyCharactersParser.parse(context));

        context.reset();
        context.moveNext(2);
        const endOpenBracketSyntaxNode = new HtmlBracketSyntaxNode('</', context.getLocation());

        context.reset();
        context.moveNext(5);
        const endSyntaxNode = new ScriptEndSyntaxNode('script', context.getLocation(), EmptyCharactersParser.parse(context));

        context.reset();
        if (context.currentCharacter !== '>') {
            context.addErrorDiagnostic('Expected ">" after script tag end.');
            context.stopFurtherExecution();
            return new ScriptSyntaxNode(
                new CompositeSyntaxNode([startOpenBracketSyntaxNode, startSyntaxNode, ...attributes, startCloseBracketSyntaxNode]),
                scriptContentSyntaxNode,
                new CompositeSyntaxNode([endOpenBracketSyntaxNode, endSyntaxNode]), null);
        }
        context.moveNext(1);
        const endCloseBracketSyntaxNode = new HtmlBracketSyntaxNode('>', context.getLocation());

        const node = new ScriptSyntaxNode(
            new CompositeSyntaxNode([startOpenBracketSyntaxNode, startSyntaxNode, ...attributes, startCloseBracketSyntaxNode]),
            scriptContentSyntaxNode,
            new CompositeSyntaxNode([endOpenBracketSyntaxNode, endSyntaxNode, endCloseBracketSyntaxNode]),
            EmptyCharactersParser.parse(context));

        return node;
    }
}