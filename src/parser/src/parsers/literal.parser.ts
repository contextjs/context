/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ParserContext } from "../context/parser-context.js";
import { SyntaxNode } from "../syntax/abstracts/syntax-node.js";
import { EndOfFileSyntaxNode } from "../syntax/end-of-file-syntax-node.js";
import { LiteralSyntaxNode } from "../syntax/literal-syntax-node.js";
import { EmptyCharactersParser } from "./empty-characters.parser.js";
import { TSHTMLParser } from "./tshtml/tshtml.parser.js";

export class LiteralParser {
    public static parse(context: ParserContext): SyntaxNode {
        let done = false;
        let value = '';

        context.reset();

        while (!done) {
            switch (context.currentCharacter) {
                case EndOfFileSyntaxNode.endOfFile:
                case '@':
                    if (TSHTMLParser.isEscapedTransition(context)) {
                        value += context.currentCharacter;
                        context.moveNext();
                    }
                    else
                        done = true;
                    break;
                case '<':
                    done = true;
                    break;
                default:
                    value += context.currentCharacter;
                    context.moveNext();
                    break;
            }
        }

        return new LiteralSyntaxNode(value, context.getLocation(), EmptyCharactersParser.parse(context));
    }
}