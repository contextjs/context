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
import { EndOfFileSyntaxNode } from "../../syntax/end-of-file-syntax-node.js";
import { CommentsParser } from "../comments.parser.js";
import { CDATAParser } from "../html/cdata.parser.js";
import { HtmlParser } from "../html/html.parser.js";
import { ScriptParser } from "../html/script.parser.js";
import { StyleParser } from "../html/style.parser.js";
import { LiteralParser } from "../literal.parser.js";
import { TypescriptParser } from "../typescript.parser.js";
import { BodyDataParser as BodyParser } from "./body.parser.js";

export class TSHTMLParser {

    public static isEscapedTransition(context: ParserContext): boolean {
        return context.currentCharacter == '@' && (context.previousCharacter === '@' || context.nextCharacter === '@');
    }

    public static parse(context: ParserContext): SyntaxNode {
        switch (context.currentCharacter) {
            case EndOfFileSyntaxNode.endOfFile:
                return new EndOfFileSyntaxNode(context.getLocation());
            case '@':
                if (this.isEscapedTransition(context))
                    return LiteralParser.parse(context);
                else if (BodyParser.isBodyStart(context))
                    return BodyParser.parse(context);
                else
                    return TypescriptParser.parse(context);
            case '<':
                if (CommentsParser.isCommentStart(context))
                    return CommentsParser.parse(context);
                else if (ScriptParser.isScriptStart(context))
                    return ScriptParser.parse(context);
                else if (CDATAParser.isCDATAStart(context))
                    return CDATAParser.parse(context);
                else if (StyleParser.isStyleStart(context))
                    return StyleParser.parse(context);
                else
                    return HtmlParser.parse(context);
            default:
                return LiteralParser.parse(context);
        }
    }

    public static createReturnSyntaxNode(nodes: SyntaxNode[], currentSyntaxNode: SyntaxNode | null): SyntaxNode {
        if (currentSyntaxNode) {
            if (nodes.length === 0)
                return currentSyntaxNode;
            else
                nodes.unshift(currentSyntaxNode);
        }

        return nodes.length === 1
            ? nodes[0]
            : new CompositeSyntaxNode(nodes);
    }
}