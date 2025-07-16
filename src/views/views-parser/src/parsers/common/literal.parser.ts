/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { StringBuilder } from "@contextjs/text";
import { ParserContext } from "../../context/parser-context.js";
import { LiteralSyntaxNode } from "../../syntax/common/literal-syntax-node.js";
import { ContentParser } from "../generic/content.parser.js";
import { TransitionParser } from "./transition.parser.js";
import { TriviaParser } from "./trivia.parser.js";

export class LiteralParser {
    public static parse(context: ParserContext): LiteralSyntaxNode {
        context.reset();

        const leadingTrivia = TriviaParser.parse(context);
        const contentNode = ContentParser.parse(
            context,
            (value, location, _leadingTrivia, trailingTrivia) => new LiteralSyntaxNode(value, location, leadingTrivia, trailingTrivia),
            LiteralParser.shouldStopParsing
        );

        return contentNode;
    }

    private static shouldStopParsing(parserContext: ParserContext, valueBuilder: StringBuilder): boolean {
        const currentCharacter = parserContext.currentCharacter;

        if (currentCharacter === "<")
            return true;

        if (currentCharacter === TransitionParser.transitionSymbol) {
            if (TransitionParser.isEscapedTransition(parserContext)) {
                parserContext.moveNext(1);
                return false;
            }

            return true;
        }

        return false;
    }
}