/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { StringBuilder } from "@contextjs/text";
import { DiagnosticMessages } from "@contextjs/views";
import { ParserContext } from "../../context/parser-context.js";
import { NameSyntaxNode, NameSyntaxNodeFactory } from "../../syntax/abstracts/name-syntax-node.js";
import { SyntaxNode } from "../../syntax/abstracts/syntax-node.js";
import { EndOfFileSyntaxNode } from "../../syntax/common/end-of-file-syntax-node.js";
import { LiteralSyntaxNode } from "../../syntax/common/literal-syntax-node.js";
import { TransitionParser } from "../common/transition.parser.js";
import { TriviaParser } from "../common/trivia.parser.js";

export class NameParser {
    public static parse<TNameSyntaxNode extends NameSyntaxNode>(
        context: ParserContext,
        nameSyntaxNodeFactory: NameSyntaxNodeFactory<TNameSyntaxNode>,
        shouldStop: (context: ParserContext) => boolean
    ): TNameSyntaxNode {

        const valueBuilder = new StringBuilder();
        const children: SyntaxNode[] = [];
        let done = false;

        context.reset();

        while (!done) {
            switch (context.currentCharacter) {
                case EndOfFileSyntaxNode.endOfFile:
                    context.addErrorDiagnostic(DiagnosticMessages.UnexpectedEndOfInput);
                    if (valueBuilder.length > 0)
                        children.push(new LiteralSyntaxNode(valueBuilder.toString(), context.getLocation()));
                    return nameSyntaxNodeFactory(children);
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
                default:
                    if (shouldStop(context)) {
                        done = true;
                        break;
                    }
                    else {
                        valueBuilder.append(context.currentCharacter);
                        context.moveNext();
                        break;
                    }
            }
        }

        if (valueBuilder.length > 0)
            children.push(new LiteralSyntaxNode(valueBuilder.toString(), context.getLocation()));

        if (children.length === 0)
            context.addErrorDiagnostic(DiagnosticMessages.InvalidName);

        return nameSyntaxNodeFactory(children, null, TriviaParser.parse(context));
    }
}