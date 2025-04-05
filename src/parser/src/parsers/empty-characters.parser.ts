/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { StringExtensions } from "@contextjs/system";
import { ParserContext } from "../context/parser-context.js";
import { SyntaxNode } from "../syntax/abstracts/syntax-node.js";
import { EndOfFileSyntaxNode } from "../syntax/end-of-file-syntax-node.js";
import { LiteralSyntaxNode } from "../syntax/literal-syntax-node.js";

export class EmptyCharactersParser {
    public static parse(context: ParserContext): SyntaxNode | null {
        let done = false;
        let value = '';

        context.reset();

        while (!done) {
            switch (context.currentCharacter) {
                case EndOfFileSyntaxNode.endOfFile:
                default:
                    if (!StringExtensions.containsOnlyLineBreaksAndSpaces(context.currentCharacter))
                        done = true;
                    else {
                        value += context.currentCharacter;
                        context.moveNext();
                    }
                    break;
            }
        }

        return value
            ? new LiteralSyntaxNode(value, context.getLocation())
            : null;
    }
}