/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { StringBuilder } from "@contextjs/text";
import { ParserContextState } from "../../../context/parser-context-state.js";
import { ParserContext } from "../../../context/parser-context.js";
import { DiagnosticMessages } from "../../../diagnostics/diagnostic-messages.js";
import { CodeSyntaxNode, CodeSyntaxNodeConstructor } from "../../../syntax/abstracts/code/code-syntax-node.js";
import { CodeValueSyntaxNode, CodeValueSyntaxNodeConstructor } from "../../../syntax/abstracts/code/code-value-syntax-node.js";
import { SyntaxNode } from "../../../syntax/abstracts/syntax-node.js";
import { EndOfFileSyntaxNode } from "../../../syntax/common/end-of-file-syntax-node.js";
import { BraceParser } from "../../common/brace.parser.js";
import { TransitionParser } from "../../common/transition.parser.js";
import { TriviaParser } from "../../common/trivia.parser.js";
import { TagParser } from "../tags/tag.parser.js";

export class BlockCodeParser {
    public static parse<
        TCodeSyntaxNode extends CodeSyntaxNode,
        TCodeValueSyntaxNode extends CodeValueSyntaxNode>(
            context: ParserContext,
            codeSyntaxNode: CodeSyntaxNodeConstructor<TCodeSyntaxNode>,
            codeValueSyntaxNode: CodeValueSyntaxNodeConstructor<TCodeValueSyntaxNode>
        ): TCodeSyntaxNode {

        context.reset();
        const transitionNode = TransitionParser.parse(context);

        context.reset();
        const openBraceNode = BraceParser.parse(context, '{');

        context.reset();
        const children: SyntaxNode[] = [transitionNode, openBraceNode];
        const valueBuilder = new StringBuilder();
        let done = false;

        while (!done) {
            switch (context.currentCharacter) {
                case EndOfFileSyntaxNode.endOfFile:
                    if (context.currentState === ParserContextState.Code)
                        context.addErrorDiagnostic(DiagnosticMessages.UnexpectedEndOfInput);
                    else if (context.currentState === ParserContextState.CodeBlock)
                        context.addErrorDiagnostic(DiagnosticMessages.ExpectedBrace(context.currentCharacter));
                    done = true;
                    break;
                case '}':
                    if (context.currentState === ParserContextState.Code)
                        done = true;
                    else {
                        valueBuilder.append(context.currentCharacter);
                        context.moveNext();
                    }
                    context.popState();
                    break;
                case '{':
                    context.setState(ParserContextState.CodeBlock);
                    valueBuilder.append(context.currentCharacter);
                    context.moveNext();
                    break;
                case '<': {
                    const tagNodes = this.tryParseTag(context, valueBuilder.toString(), codeValueSyntaxNode);
                    if (tagNodes.length === 0) {
                        valueBuilder.append(context.currentCharacter);
                        context.moveNext();
                    }
                    else {
                        children.push(...tagNodes);
                        valueBuilder.clear();
                        context.reset();
                    }
                    break;
                }
                default:
                    valueBuilder.append(context.currentCharacter);
                    context.moveNext();
                    break;
            }
        }

        if (valueBuilder.length > 0)
            children.push(new codeValueSyntaxNode(valueBuilder.toString(), context.getLocation()));


        children.push(BraceParser.parse(context, '}'));

        return new codeSyntaxNode(children, TriviaParser.parse(context));
    }

    private static tryParseTag<TCodeValueSyntaxNode extends CodeValueSyntaxNode>(
        context: ParserContext,
        code: string,
        codeValueSyntaxNode: CodeValueSyntaxNodeConstructor<TCodeValueSyntaxNode>
    ): SyntaxNode[] {

        const value = context.peekUntil((char) => char === '>' || char === EndOfFileSyntaxNode.endOfFile);
        if (value && value.endsWith(">") && TagParser.isValidTag(value)) {
            const nodes: SyntaxNode[] = [];
            nodes.push(new codeValueSyntaxNode(code, context.getLocation(), TriviaParser.parse(context)));
            nodes.push(context.parser.parse(context));

            return nodes;
        }

        return [];
    }
}