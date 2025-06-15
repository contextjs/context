/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ParserContext } from "../../context/parser-context.js";
import { DiagnosticMessages } from "../../diagnostics/diagnostic-messages.js";
import { EqualsSyntaxNode } from "../../syntax/common/equals-syntax-node.js";
import { TokenParser } from "../generic/token.parser.js";

export class EqualsParser {
    public static readonly equalsCharacter = '=';

    public static parse(context: ParserContext): EqualsSyntaxNode {
        if (context.currentCharacter !== EqualsParser.equalsCharacter)
            context.addErrorDiagnostic(DiagnosticMessages.ExpectedEquals);

        return TokenParser.parse(
            context,
            EqualsSyntaxNode,
            (context, builder) => builder.length === 1);
    }
}