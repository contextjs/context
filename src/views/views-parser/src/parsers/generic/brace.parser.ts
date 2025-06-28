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
import { BraceSyntaxNode, BraceSyntaxNodeConstructor } from "../../syntax/abstracts/brace-syntax-node.js";
import { TriviaParser } from "../common/trivia.parser.js";
import { ContentParser } from "./content.parser.js";

export class BraceParser {
    public static parse<TBraceSyntaxNode extends BraceSyntaxNode>(
        context: ParserContext,
        braceSyntaxNode: BraceSyntaxNodeConstructor<TBraceSyntaxNode>,
        expected: "{" | "}"
    ): TBraceSyntaxNode {
        const leadingTrivia = TriviaParser.parse(context);
        const node = ContentParser.parse(context, braceSyntaxNode, BraceParser.shouldStopParsing);
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