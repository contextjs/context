/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */
import { ParserContext } from "../../context/parser-context.js";
import { TypescriptCodeBlockSyntaxNode } from "../../syntax/typescript/typescript-code-block-syntax-node.js";
import { TypescriptCodeBraceSyntaxNode } from "../../syntax/typescript/typescript-code-brace-syntax-node.js";
import { TypescriptCodeExpressionSyntaxNode } from "../../syntax/typescript/typescript-code-expression-syntax-node.js";
import { TypescriptCodeValueSyntaxNode } from "../../syntax/typescript/typescript-code-value-syntax-node.js";
import { CodeParser } from "../generic/code/code.parser.js";

export class TypescriptCodeParser {
    public static parse(context: ParserContext): TypescriptCodeBlockSyntaxNode | TypescriptCodeExpressionSyntaxNode {
        return CodeParser.parse(
            context,
            (transition, openingBrace, children, closingBrace, leadingTrivia, trailingTrivia) => new TypescriptCodeBlockSyntaxNode(transition, openingBrace, children, closingBrace, leadingTrivia, trailingTrivia),
            (children, leadingTrivia, trailingTrivia) => new TypescriptCodeExpressionSyntaxNode(children, leadingTrivia, trailingTrivia),
            (children, leadingTrivia, trailingTrivia) => new TypescriptCodeValueSyntaxNode(children, leadingTrivia, trailingTrivia),
            (children, leadingTrivia, trailingTrivia) => new TypescriptCodeBraceSyntaxNode(children, leadingTrivia, trailingTrivia)
        )
    }
}