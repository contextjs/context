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
import { ValueSyntaxNode, ValueSyntaxNodeConstructor } from "../../syntax/abstracts/value-syntax-node.js";
import { EndOfFileSyntaxNode } from "../../syntax/common/end-of-file-syntax-node.js";
import { TriviaParser } from "../common/trivia.parser.js";

export class TokenParser {
    public static parse<TValueSyntaxNode extends ValueSyntaxNode>(
        context: ParserContext,
        node: ValueSyntaxNodeConstructor<TValueSyntaxNode>,
        shouldStop: (context: ParserContext, valueBuilder: StringBuilder) => boolean,
        postParse?: (context: ParserContext, valueBuilder: StringBuilder) => void
    ): TValueSyntaxNode {

        context.reset();

        const valueBuilder = new StringBuilder();
        let done = false;

        while (!done) {
            if (context.currentCharacter === EndOfFileSyntaxNode.endOfFile) {
                context.addErrorDiagnostic(DiagnosticMessages.UnexpectedEndOfInput);
                break;
            }
            if (shouldStop(context, valueBuilder))
                done = true;
            else {
                valueBuilder.append(context.currentCharacter);
                context.moveNext();
            }
        }

        if (postParse)
            postParse(context, valueBuilder);

        return new node(valueBuilder.toString(), context.getLocation(), TriviaParser.parse(context));
    }
}