/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { StringBuilder } from "@contextjs/text";
import { ParserContext } from "../../context/parser-context.js";
import { DiagnosticMessages } from "../../diagnostics/diagnostic-messages.js";
import { TransitionSyntaxNode } from "../../syntax/common/transition-syntax-node.js";
import { TokenParser } from "../generic/token.parser.js";

export class TransitionParser {
    public static transitionSymbol = '@';

    public static isEscapedTransition(parserContext: ParserContext): boolean {
        return parserContext.peekMultiple(2) === `${this.transitionSymbol}${this.transitionSymbol}`;
    }

    public static parse(parserContext: ParserContext): TransitionSyntaxNode {
        if (parserContext.currentCharacter !== this.transitionSymbol)
            parserContext.addErrorDiagnostic(DiagnosticMessages.ExpectedTransitionMarker(parserContext.currentCharacter));

        return TokenParser.parse(
            parserContext,
            TransitionSyntaxNode,
            (parserContext: ParserContext, valueBuilder: StringBuilder) => this.shouldStop(parserContext, valueBuilder)
        );
    }

    private static shouldStop(parserContext: ParserContext, valueBuilder: StringBuilder): boolean {
        const currentCharacter = parserContext.currentCharacter;
        if (currentCharacter === this.transitionSymbol) {
            valueBuilder.append(currentCharacter);
            parserContext.moveNext();

            return true;
        }

        return false;
    }
}