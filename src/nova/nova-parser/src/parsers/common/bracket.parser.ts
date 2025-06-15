/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ParserContext } from "../../context/parser-context.js";
import { DiagnosticMessages } from "../../diagnostics/diagnostic-messages.js";
import { BracketSyntaxNode } from "../../syntax/common/bracket-syntax-node.js";
import { TokenParser } from "../generic/token.parser.js";

export class BracketParser {
    public static parse(context: ParserContext, expected: "<" | ">" | "/>" | "</"): BracketSyntaxNode {
        if (context.peekMultiple(expected.length) !== expected)
            context.addErrorDiagnostic(DiagnosticMessages.ExpectedBracket(expected));

        return TokenParser.parse(
            context,
            BracketSyntaxNode,
            (context, builder) => {
                if (context.peekMultiple(expected.length) === expected) {
                    builder.append(expected);
                    context.moveNext(expected.length)
                    return true;
                }
                return false;
            }
        );
    }
}