/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */
import { ParserContext } from "../../context/parser-context.js";
import { TypescriptCodeSyntaxNode } from "../../syntax/tshtml/typescript-code-syntax-node.js";
import { TypescriptCodeValueSyntaxNode } from "../../syntax/tshtml/typescript-code-value-syntax-node.js";
import { CodeParser } from "../generic/code/code.parser.js";

export class TypescriptCodeParser {
    public static parse(context: ParserContext): TypescriptCodeSyntaxNode {
        return CodeParser.parse(context, TypescriptCodeSyntaxNode, TypescriptCodeValueSyntaxNode);
    }
}