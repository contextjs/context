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
import { EqualsSyntaxNode } from "../../syntax/common/equals-syntax-node.js";
import { ContentParser } from "../generic/content.parser.js";

export class EqualsParser {
    public static readonly equalsCharacter = '=';

    public static parse(context: ParserContext): EqualsSyntaxNode {
        const node = ContentParser.parse(context, EqualsSyntaxNode, EqualsParser.shouldStopParsing)

        if (node.value !== EqualsParser.equalsCharacter)
            context.addErrorDiagnostic(DiagnosticMessages.ExpectedEquals);

        return node;
    }

    private static shouldStopParsing(parserContext: ParserContext, valueBuilder: StringBuilder): boolean {
        const currentCharacter = parserContext.currentCharacter;

        if (currentCharacter === EqualsParser.equalsCharacter) {
            valueBuilder.append(currentCharacter);
            parserContext.moveNext();
            return true;
        }

        return false;
    }
}