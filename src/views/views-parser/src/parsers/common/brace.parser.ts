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
import { BraceSyntaxNode } from "../../syntax/common/brace-syntax-node.js";
import { TriviaParser } from "../common/trivia.parser.js";
import { ContentParser } from "../generic/content.parser.js";

export class BraceParser {
    public static parse(context: ParserContext, expected: "{" | "}"): BraceSyntaxNode {
        const leadingTrivia = TriviaParser.parse(context);
        const node = ContentParser.parse(context, BraceSyntaxNode, BraceParser.shouldStopParsing);
        node.leadingTrivia = leadingTrivia;
        node.trailingTrivia = TriviaParser.parse(context);

        if (StringExtensions.isNullOrWhitespace(node.value) || node.value !== expected)
            context.addErrorDiagnostic(DiagnosticMessages.ExpectedBrace(node?.value ?? context.currentCharacter));

        return node;
    }

    private static shouldStopParsing(parserContext: ParserContext, valueBuilder: StringBuilder): boolean {
        const currentCharacter = parserContext.currentCharacter;

        if (currentCharacter === "{" || currentCharacter === "}") {
            valueBuilder.append(currentCharacter);
            parserContext.moveNext();

            return true;
        }

        return false;
    }
}