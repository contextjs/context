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
import { CommentSyntaxNode } from "../syntax/tshtml/comment-syntax-node.js";
import { EmptyCharactersParser } from "./empty-characters.parser.js";

export class CommentsParser {
    public static isCommentStart(context: ParserContext): boolean {
        return context.peekMultiple(4) == '<!--';
    }

    public static isTypescriptCommentStart(context: ParserContext): boolean {
        const commentStart = context.peekMultiple(2);
        return commentStart == '//' || commentStart == '/*';
    }

    public static parse(context: ParserContext): SyntaxNode {
        if (context.peekMultiple(2) == '//')
            return CommentsParser.parseInlineComment(context);
        else if (context.peekMultiple(2) == '/*')
            return CommentsParser.parseBlockComment(context, '*/');
        else if (context.peekMultiple(4) == '<!--')
            return CommentsParser.parseBlockComment(context, '-->');
        else {
            context.addErrorDiagnostic('Invalid comment');
            context.stopFurtherExecution();
            return new CommentSyntaxNode('', context.getLocation());
        }
    }

    private static parseInlineComment(context: ParserContext): SyntaxNode {
        let value = '';

        context.reset();

        while (!StringExtensions.isLineBreak(context.currentCharacter) && context.currentCharacter !== EndOfFileSyntaxNode.endOfFile) {
            value += context.currentCharacter;
            context.moveNext();
        }

        return new CommentSyntaxNode(value, context.getLocation(), EmptyCharactersParser.parse(context));
    }

    private static parseBlockComment(context: ParserContext, endTag: string): SyntaxNode {
        let value = '';

        context.reset();

        while (context.peekMultiple(endTag.length) !== endTag && context.currentCharacter !== EndOfFileSyntaxNode.endOfFile) {
            value += context.currentCharacter;
            context.moveNext();
        }

        value += context.peekMultiple(endTag.length);
        context.moveNext(endTag.length);

        return new CommentSyntaxNode(value, context.getLocation(), EmptyCharactersParser.parse(context));
    }
}