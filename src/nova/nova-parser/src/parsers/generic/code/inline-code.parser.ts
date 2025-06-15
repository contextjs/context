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
import { CodeSyntaxNode, CodeSyntaxNodeConstructor } from "../../../syntax/abstracts/code/code-syntax-node.js";
import { CodeValueSyntaxNode, CodeValueSyntaxNodeConstructor } from "../../../syntax/abstracts/code/code-value-syntax-node.js";
import { SyntaxNode } from "../../../syntax/abstracts/syntax-node.js";
import { EndOfFileSyntaxNode } from "../../../syntax/common/end-of-file-syntax-node.js";
import { CommentParser } from "../../common/comment.parser.js";
import { TransitionParser } from "../../common/transition.parser.js";
import { TriviaParser } from "../../common/trivia.parser.js";

export class InlineCodeParser {
    public static parse<
        TCodeSyntaxNode extends CodeSyntaxNode,
        TCodeValueSyntaxNode extends CodeValueSyntaxNode>(
            context: ParserContext,
            codeSyntaxNode: CodeSyntaxNodeConstructor<TCodeSyntaxNode>,
            codeValueSyntaxNode: CodeValueSyntaxNodeConstructor<TCodeValueSyntaxNode>
        ): TCodeSyntaxNode {

        const children: SyntaxNode[] = [];

        context.reset();
        children.push(TransitionParser.parse(context));

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
        if (valueBuilder.length > 0)
            children.push(new codeValueSyntaxNode(valueBuilder.toString(), context.getLocation()));

        return new codeSyntaxNode(children, TriviaParser.parse(context));
    }
}