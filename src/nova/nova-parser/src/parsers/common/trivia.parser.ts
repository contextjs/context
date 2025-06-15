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
import { TriviaSyntaxNode } from "../../syntax/common/trivia-syntax-node.js";

export class TriviaParser {
    public static parse(parserContext: ParserContext): TriviaSyntaxNode | null {
        const valueBuilder = new StringBuilder();
        parserContext.reset();

        while (StringExtensions.containsOnlyWhitespace(parserContext.currentCharacter)) {
            valueBuilder.append(parserContext.currentCharacter);
            parserContext.moveNext();
        }

        return valueBuilder.length > 0
            ? new TriviaSyntaxNode(valueBuilder.toString(), parserContext.getLocation())
            : null;
    }
}