/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { StringBuilder } from "@contextjs/text";
import { ParserContext } from "../../context/parser-context.js";
import { DiagnosticMessages } from "../../diagnostics/diagnostic-messages.js";
import { SyntaxNode } from "../../syntax/abstracts/syntax-node.js";
import { EndOfFileSyntaxNode } from "../../syntax/common/end-of-file-syntax-node.js";
import { LiteralSyntaxNode } from "../../syntax/common/literal-syntax-node.js";
import { CDATAContentSyntaxNode } from "../../syntax/html/cdata/cdata-content-syntax-node.js";
import { CDATAEndSyntaxNode } from "../../syntax/html/cdata/cdata-end-syntax-node.js";
import { CDATAStartSyntaxNode } from "../../syntax/html/cdata/cdata-start-syntax-node.js";
import { CDATASyntaxNode } from "../../syntax/html/cdata/cdata-syntax-node.js";
import { TriviaParser } from "../common/trivia.parser.js";

export class CDATAParser {
    public static isCDATAStart(context: ParserContext): boolean {
        return context.peekMultiple(9).toLowerCase() === '<![cdata[';
    }

    public static parse(context: ParserContext): SyntaxNode {
        context.reset();

        if (!this.isCDATAStart(context)) {
            context.addErrorDiagnostic(DiagnosticMessages.ExpectedCDATAStart);
            return new LiteralSyntaxNode(context.currentCharacter, context.getLocation());
        }

        context.moveNext(9);
        const startNode = new CDATAStartSyntaxNode('<![CDATA[', context.getLocation());

        context.reset();
        const valueBuilder = new StringBuilder();
        let done = false;

        while (!done) {
            if (context.currentCharacter === EndOfFileSyntaxNode.endOfFile) {
                context.addErrorDiagnostic(DiagnosticMessages.UnexpectedEndOfInput);
                done = true;
                break;
            }
            if (context.peekMultiple(3) === ']]>') {
                done = true;
                break;
            }

            valueBuilder.append(context.currentCharacter);
            context.moveNext();
        }

        const contentNode = new CDATAContentSyntaxNode(valueBuilder.toString(), context.getLocation());

        context.reset();
        let endNode: CDATAEndSyntaxNode;
        if (context.peekMultiple(3) === ']]>') {
            context.moveNext(3);
            endNode = new CDATAEndSyntaxNode(']]>', context.getLocation());
        }
        else {
            context.addErrorDiagnostic(DiagnosticMessages.MissingCDATAEnd);
            endNode = new CDATAEndSyntaxNode(context.currentCharacter, context.getLocation());
        }

        return new CDATASyntaxNode(startNode, contentNode, endNode, null, TriviaParser.parse(context));
    }
}