/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { StringExtensions } from "@contextjs/system";
import { StringBuilder } from "@contextjs/text";
import { ParserContext } from "../../context/parser-context.js";
import { DiagnosticMessages } from "../../diagnostics/diagnostic-messages.js";
import { BracketSyntaxNode } from "../../syntax/common/bracket-syntax-node.js";
import { ContentParser } from "../generic/content.parser.js";
import { TriviaParser } from "./trivia.parser.js";

export class BracketParser {
    public static parse(context: ParserContext, expected: "<" | ">" | "/>" | "</"): BracketSyntaxNode {
        const leadingTrivia = TriviaParser.parse(context);

        const node = ContentParser.parse(
            context,
            BracketSyntaxNode,
            (parserContext, valueBuilder) => BracketParser.shouldStopParsing(parserContext, valueBuilder, expected));

        node.leadingTrivia = leadingTrivia;
        node.trailingTrivia = TriviaParser.parse(context);

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