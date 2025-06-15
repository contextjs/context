/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ParserContext } from "../../context/parser-context.js";
import { DiagnosticMessages } from "../../diagnostics/diagnostic-messages.js";
import { BraceSyntaxNode } from "../../syntax/common/brace-syntax-node.js";
import { TokenParser } from "../generic/token.parser.js";

export class BraceParser {
    public static parse(context: ParserContext, expected: "{" | "}"): BraceSyntaxNode {
        if (context.peek() !== expected)
            context.addErrorDiagnostic(DiagnosticMessages.ExpectedBrace(expected));

        return TokenParser.parse(
            context,
            BraceSyntaxNode,
            (context, builder) => {
                if (context.peek() === expected) {
                    builder.append(expected);
                    context.moveNext();
                    return true;
                }
                return false;
            }
        );
    }
}