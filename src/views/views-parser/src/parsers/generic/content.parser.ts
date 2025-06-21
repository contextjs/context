/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { StringBuilder } from "@contextjs/text";
import { ParserContext } from "../../context/parser-context.js";
import { ValueSyntaxNode, ValueSyntaxNodeConstructor } from "../../syntax/abstracts/value-syntax-node.js";
import { EndOfFileSyntaxNode } from "../../syntax/common/end-of-file-syntax-node.js";

export class ContentParser {
    public static parse<TValueSyntaxNode extends ValueSyntaxNode>(
        context: ParserContext,
        node: ValueSyntaxNodeConstructor<TValueSyntaxNode>,
        shouldStopParsing: (context: ParserContext, valueBuilder: StringBuilder) => boolean
    ): TValueSyntaxNode {

        context.reset();

        const valueBuilder = new StringBuilder();
        let done = false;

        while (!done) {
            if (context.currentCharacter === EndOfFileSyntaxNode.endOfFile || shouldStopParsing(context, valueBuilder))
                done = true;
            else {
                valueBuilder.append(context.currentCharacter);
                context.moveNext();
            }
        }

        return new node(valueBuilder.toString(), context.getLocation());
    }
}