/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { StringBuilder } from "@contextjs/text";
import { DiagnosticMessages } from "@contextjs/views";
import { ParserContextState } from "../../../context/parser-context-state.js";
import { ParserContext } from "../../../context/parser-context.js";
import { BraceSyntaxNode, BraceSyntaxNodeConstructor } from "../../../syntax/abstracts/brace-syntax-node.js";
import { CodeBlockSyntaxNode, CodeBlockSyntaxNodeConstructor } from "../../../syntax/abstracts/code/code-block-syntax-node.js";
import { CodeValueSyntaxNode, CodeValueSyntaxNodeConstructor } from "../../../syntax/abstracts/code/code-value-syntax-node.js";
import { SyntaxNode } from "../../../syntax/abstracts/syntax-node.js";
import { EndOfFileSyntaxNode } from "../../../syntax/common/end-of-file-syntax-node.js";
import { TransitionParser } from "../../common/transition.parser.js";
import { TriviaParser } from "../../common/trivia.parser.js";
import { BraceParser } from "../../generic/brace.parser.js";
import { TagParser } from "../tags/tag.parser.js";

export class BlockCodeParser {
    public static parse<
        TCodeBlockSyntaxNode extends CodeBlockSyntaxNode,
        TCodeValueSyntaxNode extends CodeValueSyntaxNode>(
            context: ParserContext,
            codeBlockSyntaxNode: CodeBlockSyntaxNodeConstructor<TCodeBlockSyntaxNode>,
            codeValueSyntaxNode: CodeValueSyntaxNodeConstructor<TCodeValueSyntaxNode>,
            braceSyntaxNode: BraceSyntaxNodeConstructor<BraceSyntaxNode>
        ): TCodeBlockSyntaxNode {

        context.reset();
        const transitionNode = TransitionParser.parse(context);

        context.reset();
        const openBraceNode = BraceParser.parse(context, braceSyntaxNode, '{');

        context.reset();
        const children: SyntaxNode[] = [];
        const valueBuilder = new StringBuilder();
        let done = false;

        context.setState(ParserContextState.RootBlock);

        // ---- Quote tracking state ----
        let inSingleQuote = false;
        let inDoubleQuote = false;
        let inBacktick = false;
        let prevChar = "";

        while (!done) {
            const ch = context.currentCharacter;

            // Update quote state (handles basic escaping, but can be extended)
            if (ch === "'" && !inDoubleQuote && !inBacktick && prevChar !== '\\') inSingleQuote = !inSingleQuote;
            else if (ch === '"' && !inSingleQuote && !inBacktick && prevChar !== '\\') inDoubleQuote = !inDoubleQuote;
            else if (ch === '`' && !inSingleQuote && !inDoubleQuote && prevChar !== '\\') inBacktick = !inBacktick;

            const insideQuotes = inSingleQuote || inDoubleQuote || inBacktick;

            switch (ch) {
                case EndOfFileSyntaxNode.endOfFile:
                    if (context.currentState === ParserContextState.RootBlock)
                        context.addErrorDiagnostic(DiagnosticMessages.UnexpectedEndOfInput);
                    else if (context.currentState === ParserContextState.NestedBlock)
                        context.addErrorDiagnostic(DiagnosticMessages.ExpectedBrace(context.currentCharacter));
                    done = true;
                    break;
                case '}':
                    if (!insideQuotes) {
                        if (context.currentState === ParserContextState.RootBlock)
                            done = true;
                        else {
                            valueBuilder.append(ch);
                            context.moveNext();
                        }
                        context.popState();
                        break;
                    }
                    valueBuilder.append(ch);
                    context.moveNext();
                    break;
                case '{':
                    if (!insideQuotes) {
                        context.setState(ParserContextState.NestedBlock);
                        valueBuilder.append(ch);
                        context.moveNext();
                        break;
                    }
                    valueBuilder.append(ch);
                    context.moveNext();
                    break;
                case '<': {
                    if (!insideQuotes) {
                        const tagNodes = this.tryParseTag(context, valueBuilder.toString(), codeValueSyntaxNode);
                        if (tagNodes.length === 0) {
                            valueBuilder.append(ch);
                            context.moveNext();
                        }
                        else {
                            children.push(...tagNodes);
                            valueBuilder.clear();
                            context.reset();
                        }
                        break;
                    }
                    valueBuilder.append(ch);
                    context.moveNext();
                    break;
                }
                default:
                    valueBuilder.append(ch);
                    context.moveNext();
                    break;
            }

            prevChar = ch;
        }

        if (valueBuilder.length > 0)
            children.push(new codeValueSyntaxNode(valueBuilder.toString(), context.getLocation()));

        const closingBraceNode = BraceParser.parse(context, braceSyntaxNode, '}');

        return new codeBlockSyntaxNode(transitionNode, openBraceNode, children, closingBraceNode, null, TriviaParser.parse(context));
    }

    private static tryParseTag<TCodeValueSyntaxNode extends CodeValueSyntaxNode>(
        context: ParserContext,
        code: string,
        codeValueSyntaxNode: CodeValueSyntaxNodeConstructor<TCodeValueSyntaxNode>
    ): SyntaxNode[] {

        const value = context.peekUntil((char) => char === '>' || char === EndOfFileSyntaxNode.endOfFile);
        if (value && value.endsWith(">") && TagParser.isValidTag(value)) {
            const nodes: SyntaxNode[] = [];
            nodes.push(new codeValueSyntaxNode(code, context.getLocation()));
            nodes.push(context.parser.parse(context));

            return nodes;
        }

        return [];
    }
}
