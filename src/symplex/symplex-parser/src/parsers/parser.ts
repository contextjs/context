/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ParserContext } from "../context/parser-context.js";
import { Source } from "../sources/source.js";
import { SyntaxNode } from "../syntax/abstracts/syntax-node.js";
import { EndOfFileSyntaxNode } from "../syntax/end-of-file-syntax-node.js";
import { ParserResult } from "./parser-result.js";
import { TSHTMLParser } from "./tshtml/tshtml.parser.js";

export class Parser {
    public static parse(text: string): ParserResult {
        const context = new ParserContext(new Source(text));
        const result = new ParserResult();

        let currentNode: SyntaxNode;
        let done = false;

        while (done === false) {
            currentNode = TSHTMLParser.parse(context);
            result.nodes.push(currentNode);
            if (context.stopped || currentNode instanceof EndOfFileSyntaxNode)
                done = true;
        }

        result.diagnostics = context.diagnostics;

        return result;
    }
}