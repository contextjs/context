/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { StringExtensions } from "@contextjs/system";
import { StringBuilder } from "@contextjs/text";
import { DiagnosticMessages } from "@contextjs/views";
import { ParserContext } from "../../context/parser-context.js";
import { BracketSyntaxNode, BracketSyntaxNodeFactory } from "../../syntax/abstracts/bracket-syntax-node.js";
import { TriviaParser } from "../common/trivia.parser.js";
import { ContentParser } from "./content.parser.js";

export class BracketParser {
    public static parse<TBracketSyntaxNode extends BracketSyntaxNode>(
        context: ParserContext,
        bracketSyntaxNodeFactory: BracketSyntaxNodeFactory<TBracketSyntaxNode>,
        expected: "<" | ">" | "/>" | "</"
    ): TBracketSyntaxNode {
        const leadingTrivia = TriviaParser.parse(context);

        const node = ContentParser.parse(
            context,
            (value, location) => bracketSyntaxNodeFactory(value, location, leadingTrivia, TriviaParser.parse(context)),
            (parserContext, valueBuilder) => BracketParser.shouldStopParsing(parserContext, valueBuilder, expected)
        );

        if (StringExtensions.isNullOrWhitespace(node.value) || node.value !== expected)
            context.addErrorDiagnostic(DiagnosticMessages.ExpectedBracket(node?.value ?? context.currentCharacter));

        return node;
    }

    private static shouldStopParsing(parserContext: ParserContext, valueBuilder: StringBuilder, expected: "<" | ">" | "/>" | "</"): boolean {
        if (parserContext.peekMultiple(expected.length) === expected) {
            valueBuilder.append(expected);
            parserContext.moveNext(expected.length)

            return true;
        }

        return false;
    }
}