/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { StringExtensions } from "@contextjs/system";
import { StringBuilder } from "@contextjs/text";
import { ParserContext } from "../../../context/parser-context.js";
import { CodeExpressionSyntaxNode, CodeExpressionSyntaxNodeConstructor } from "../../../syntax/abstracts/code/code-expression-syntax-node.js";
import { CodeValueSyntaxNode, CodeValueSyntaxNodeConstructor } from "../../../syntax/abstracts/code/code-value-syntax-node.js";
import { EndOfFileSyntaxNode } from "../../../syntax/common/end-of-file-syntax-node.js";
import { CommentParser } from "../../common/comment.parser.js";
import { TransitionParser } from "../../common/transition.parser.js";
import { TriviaParser } from "../../common/trivia.parser.js";

export class InlineCodeParser {
    public static parse<
        TCodeExpressionSyntaxNode extends CodeExpressionSyntaxNode,
        TCodeValueSyntaxNode extends CodeValueSyntaxNode>(
            context: ParserContext,
            codeExpressionSyntaxNode: CodeExpressionSyntaxNodeConstructor<TCodeExpressionSyntaxNode>,
            codeValueSyntaxNode: CodeValueSyntaxNodeConstructor<TCodeValueSyntaxNode>
        ): TCodeExpressionSyntaxNode {

        context.reset();
        const transitionNode = context.ensureProgress(
            () => TransitionParser.parse(context),
            "TransitionParser did not advance context (inline code)."
        );
        transitionNode.trailingTrivia = TriviaParser.parse(context);

        context.reset();
        const valueBuilder = new StringBuilder();
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
                case '>':
                case '<':
                    done = true;
                    break;
                case TransitionParser.transitionSymbol:
                    if (TransitionParser.isEscapedTransition(context)) {
                        valueBuilder.append(TransitionParser.transitionSymbol);
                        context.moveNext(2);
                    }
                    else
                        done = true;
                    break;
                case '/':
                    if (context.nextCharacter === '>' || CommentParser.isCommentStart(context))
                        done = true;
                    else {
                        valueBuilder.append(context.currentCharacter);
                        context.moveNext();
                    }
                    break;
                default:
                    if (StringExtensions.isLineBreak(context.currentCharacter))
                        done = true;
                    else {
                        valueBuilder.append(context.currentCharacter);
                        context.moveNext();
                    }
                    break;
            }
        }

        const valueNode = new codeValueSyntaxNode(valueBuilder.toString(), context.getLocation(), null, TriviaParser.parse(context));
        return new codeExpressionSyntaxNode(transitionNode, valueNode);
    }
}