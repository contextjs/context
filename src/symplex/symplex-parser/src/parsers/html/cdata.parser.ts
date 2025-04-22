/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ParserContext } from "../../context/parser-context.js";
import { SyntaxNode } from "../../syntax/abstracts/syntax-node.js";
import { EndOfFileSyntaxNode } from "../../syntax/end-of-file-syntax-node.js";
import { CDATAContentSyntaxNode } from "../../syntax/html/cdata/cdata-content-syntax-node.js";
import { CDATAEndSyntaxNode } from "../../syntax/html/cdata/cdata-end-syntax-node.js";
import { CDATAStartSyntaxNode } from "../../syntax/html/cdata/cdata-start-syntax-node.js";
import { CDATASyntaxNode } from "../../syntax/html/cdata/cdata-syntax-node.js";
import { EmptyCharactersParser } from "../empty-characters.parser.js";

export class CDATAParser {
    public static isCDATAStart(context: ParserContext): boolean {
        return context.peekMultiple(9).toLowerCase() === '<![cdata[';
    }

    public static parse(context: ParserContext): SyntaxNode {
        let done = false;
        let value = '';

        context.reset();
        context.moveNext(9);
        const startSyntaxNode = new CDATAStartSyntaxNode('<![CDATA[', context.getLocation());

        context.reset();

        while (!done) {
            switch (context.currentCharacter) {
                case EndOfFileSyntaxNode.endOfFile:
                    context.addErrorDiagnostic('Unexpected end of file while parsing "CDATA" section.');
                    done = true;
                    break;
                default:
                    if (context.peekMultiple(3) === ']]>')
                        done = true;
                    else {
                        value += context.currentCharacter;
                        context.moveNext();
                    }
                    break;
            }
        }

        const contentSyntaxNode = new CDATAContentSyntaxNode(value, context.getLocation());

        context.reset();
        context.moveNext(3);
        const endSyntaxNode = new CDATAEndSyntaxNode(']]>', context.getLocation());

        return new CDATASyntaxNode(startSyntaxNode, contentSyntaxNode, endSyntaxNode, EmptyCharactersParser.parse(context));
    }
}