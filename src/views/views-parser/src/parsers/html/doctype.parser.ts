/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { StringBuilder } from "@contextjs/text";
import { DiagnosticMessages } from "@contextjs/views";
import { EndOfFileSyntaxNode } from "../../api/index.js";
import { ParserContext } from "../../context/parser-context.js";
import { DoctypeSyntaxNode } from "../../syntax/html/doctype-syntax-node.js";
import { TriviaParser } from "../common/trivia.parser.js";
import { ContentParser } from "../generic/content.parser.js";
import { StringExtensions } from "@contextjs/system";

export class DoctypeParser {
    public static isDoctypeStart(context: ParserContext): boolean {
        return context.peekMultiple(9).toLowerCase() === '<!doctype';
    }

    public static parse(context: ParserContext): DoctypeSyntaxNode {
        const result = ContentParser.parse(context, DoctypeSyntaxNode, DoctypeParser.shouldStopParsing);
        result.trailingTrivia = TriviaParser.parse(context);

        if (!result.value?.endsWith('>'))
            context.addErrorDiagnostic(DiagnosticMessages.UnterminatedDoctype);

        return result;
    }

    private static shouldStopParsing(context: ParserContext, valueBuilder: StringBuilder): boolean {
        if (context.currentCharacter === '>') {
            valueBuilder.append('>');
            context.moveNext();
            return true;
        }
        if (StringExtensions.isLineBreak(context.currentCharacter))
            return true;

        return false;
    }
}