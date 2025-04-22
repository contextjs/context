/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ParserContext } from "../../context/parser-context.js";
import { SyntaxNode } from "../../syntax/abstracts/syntax-node.js";
import { CompositeSyntaxNode } from "../../syntax/composite-syntax-node.js";
import { BodySyntaxNode } from "../../syntax/tshtml/body-syntax-node.js";
import { TransitionSyntaxNode } from "../../syntax/tshtml/transition-syntax-node.js";
import { EmptyCharactersParser } from "../empty-characters.parser.js";

export class BodyDataParser {
    public static isBodyStart(context: ParserContext): boolean {
        return context.peekMultiple(5).toLowerCase() === '@body';
    }

    public static parse(context: ParserContext): SyntaxNode {
        context.reset();
        context.moveNext(1);
        const transitionSyntaxNode = new TransitionSyntaxNode(context.getLocation());

        context.reset();
        context.moveNext(4);
        const bodySyntaxNode = new BodySyntaxNode(context.getLocation(), EmptyCharactersParser.parse(context));

        return new CompositeSyntaxNode([transitionSyntaxNode, bodySyntaxNode]);
    }
}