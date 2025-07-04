/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ObjectExtensions } from "@contextjs/system";
import { ParserContext } from "../context/parser-context.js";
import { NoParserFoundException } from "../exceptions/no-parser-found.exception.js";
import { Source } from "../sources/source.js";
import { SyntaxNode } from "../syntax/abstracts/syntax-node.js";
import { EndOfFileSyntaxNode } from "../syntax/common/end-of-file-syntax-node.js";
import { Language } from "./language.js";
import { ParserResolver } from "./parser-resolver.js";
import { ParserResult } from "./parser-result.js";

export type ParserType = { parse(context: ParserContext): SyntaxNode } | null;

export class Parser {
    public static parse(text: string, language: Language): ParserResult {

        const parser = ParserResolver.resolve(language);
        if (ObjectExtensions.isNullOrUndefined(parser))
            throw new NoParserFoundException(language.toString());

        const context = new ParserContext(new Source(text), parser);
        const result = new ParserResult();

        let currentNode: SyntaxNode;
        let done = false;

        while (done === false) {
            currentNode = parser.parse(context);
            if (!ObjectExtensions.isNullOrUndefined(currentNode))
                result.nodes.push(currentNode);
            if (currentNode instanceof EndOfFileSyntaxNode)
                done = true;
        }

        result.diagnostics = context.diagnostics;

        return result;
    }
}