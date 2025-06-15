/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ParserContext } from "../../context/parser-context.js";
import { SyntaxNode } from "../../syntax/abstracts/syntax-node.js";
import { EndOfFileSyntaxNode } from "../../syntax/common/end-of-file-syntax-node.js";
import { CommentParser } from "../common/comment.parser.js";
import { LiteralParser } from "../common/literal.parser.js";
import { TransitionParser } from "../common/transition.parser.js";
import { CDATAParser } from "../html/cdata.parser.js";
import { HtmlTagParser } from "../html/html-tag.parser.js";
import { ScriptParser } from "../html/script.parser.js";
import { StyleParser } from "../html/style.parser.js";
import { TypescriptCodeParser } from "./typescript-code.parser.js";

export class TSHTMLParser {
    public static parse(context: ParserContext): SyntaxNode {
        switch (context.currentCharacter) {
            case EndOfFileSyntaxNode.endOfFile:
                return new EndOfFileSyntaxNode(context.getLocation());
            case TransitionParser.transitionSymbol:
                if (TransitionParser.isEscapedTransition(context))
                    return LiteralParser.parse(context);
                else
                    return TypescriptCodeParser.parse(context);
            case '<':
                if (CommentParser.isCommentStart(context))
                    return CommentParser.parse(context);
                else if (CDATAParser.isCDATAStart(context))
                    return CDATAParser.parse(context);
                else if (StyleParser.isStyleStart(context))
                    return StyleParser.parse(context);
                else if (ScriptParser.isScriptStart(context))
                    return ScriptParser.parse(context);
                else
                    return HtmlTagParser.parse(context);
            case '/':
                if (CommentParser.isCommentStart(context))
                    return CommentParser.parse(context);
                else
                    return LiteralParser.parse(context);
            default:
                return LiteralParser.parse(context);
        }
    }
}