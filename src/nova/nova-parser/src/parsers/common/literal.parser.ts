/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { StringBuilder } from "@contextjs/text";
import { ParserContext } from "../../context/parser-context.js";
import { EndOfFileSyntaxNode } from "../../syntax/common/end-of-file-syntax-node.js";
import { LiteralSyntaxNode } from "../../syntax/common/literal-syntax-node.js";
import { TransitionParser } from "./transition.parser.js";

export class LiteralParser {
    public static parse(context: ParserContext): LiteralSyntaxNode {
        const valueBuilder = new StringBuilder();
        let done = false;

        context.reset();

        while (!done) {
            switch (context.currentCharacter) {
                case EndOfFileSyntaxNode.endOfFile:
                case '<':
                    done = true;
                    break;
                case TransitionParser.transitionSymbol:
                    if (TransitionParser.isEscapedTransition(context)) {
                        valueBuilder.append(TransitionParser.transitionSymbol);
                        context.moveNext(2);
                    }
                    else
                        done = true;
                    break;
                default:
                    valueBuilder.append(context.currentCharacter);
                    context.moveNext();
                    break;
            }
        }

        return new LiteralSyntaxNode(valueBuilder.toString(), context.getLocation());
    }
}