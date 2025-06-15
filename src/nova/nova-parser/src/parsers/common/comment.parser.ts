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
import { DiagnosticMessages } from "../../diagnostics/diagnostic-messages.js";
import { CommentSyntaxNode } from "../../syntax/common/comment-syntax-node.js";
import { EndOfFileSyntaxNode } from "../../syntax/common/end-of-file-syntax-node.js";
import { TriviaParser } from "./trivia.parser.js";

export class CommentParser {
    public static isCommentStart(parserContext: ParserContext): boolean {
        return parserContext.peekMultiple(4) == '<!--' || parserContext.peekMultiple(2) == '//' || parserContext.peekMultiple(2) == '/*';
    }

    public static parse(context: ParserContext, valueBuilder: StringBuilder = new StringBuilder()): CommentSyntaxNode {
        if (context.peekMultiple(2) == '//')
            return CommentParser.parseInlineComment(context, valueBuilder);
        else if (context.peekMultiple(2) == '/*')
            return CommentParser.parseBlockComment(context, '*/', valueBuilder);
        else if (context.peekMultiple(4) == '<!--')
            return CommentParser.parseBlockComment(context, '-->', valueBuilder);
        else {
            context.addErrorDiagnostic(DiagnosticMessages.InvalidComment);
            return new CommentSyntaxNode(context.currentCharacter, context.getLocation(), TriviaParser.parse(context));
        }
    }

    private static parseInlineComment(parserContext: ParserContext, valueBuilder: StringBuilder): CommentSyntaxNode {
        parserContext.reset();

        while (!StringExtensions.isLineBreak(parserContext.currentCharacter) && parserContext.currentCharacter !== EndOfFileSyntaxNode.endOfFile) {
            valueBuilder.append(parserContext.currentCharacter);
            parserContext.moveNext();
        }

        return new CommentSyntaxNode(valueBuilder.toString(), parserContext.getLocation(), TriviaParser.parse(parserContext));
    }

    private static parseBlockComment(parserContext: ParserContext, endTag: string, valueBuilder: StringBuilder): CommentSyntaxNode {
        parserContext.reset();

        while (parserContext.peekMultiple(endTag.length) !== endTag && parserContext.currentCharacter !== EndOfFileSyntaxNode.endOfFile) {
            valueBuilder.append(parserContext.currentCharacter);
            parserContext.moveNext();
        }

        if (parserContext.peekMultiple(endTag.length) === endTag) {
            valueBuilder.append(endTag);
            parserContext.moveNext(endTag.length);
        }
        else if (parserContext.currentCharacter !== EndOfFileSyntaxNode.endOfFile)
            parserContext.addErrorDiagnostic(DiagnosticMessages.UnterminatedComment(endTag));

        return new CommentSyntaxNode(valueBuilder.toString(), parserContext.getLocation(), TriviaParser.parse(parserContext));
    }
}