/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { CodeBlockSyntaxNode, CodeBlockSyntaxNodeFactory } from "../../../api/index.js";
import { ParserContext } from "../../../context/parser-context.js";
import { BraceSyntaxNode, BraceSyntaxNodeFactory } from "../../../syntax/abstracts/brace-syntax-node.js";
import { CodeExpressionSyntaxNode, CodeExpressionSyntaxNodeFactory } from "../../../syntax/abstracts/code/code-expression-syntax-node.js";
import { CodeValueSyntaxNode, CodeValueSyntaxNodeFactory } from "../../../syntax/abstracts/code/code-value-syntax-node.js";
import { BlockCodeParser } from "./block-code.parser.js";
import { InlineCodeParser } from "./inline-code.parser.js";

export class CodeParser {
    public static parse<
        TCodeBlockSyntaxNode extends CodeBlockSyntaxNode,
        TCodeExpressionSyntaxNode extends CodeExpressionSyntaxNode,
        TCodeValueSyntaxNode extends CodeValueSyntaxNode,
        TBraceSyntaxNode extends BraceSyntaxNode>(
            context: ParserContext,
            codeBlockSyntaxNodeFactory: CodeBlockSyntaxNodeFactory<TCodeBlockSyntaxNode>,
            codeExpressionSyntaxNodeFactory: CodeExpressionSyntaxNodeFactory<TCodeExpressionSyntaxNode>,
            codeValueSyntaxNodeFactory: CodeValueSyntaxNodeFactory<TCodeValueSyntaxNode>,
            braceSyntaxNodeFactory: BraceSyntaxNodeFactory<TBraceSyntaxNode>
        ): TCodeExpressionSyntaxNode | TCodeBlockSyntaxNode {

        if (context.nextCharacter === '{')
            return BlockCodeParser.parse(context, codeBlockSyntaxNodeFactory, codeValueSyntaxNodeFactory, braceSyntaxNodeFactory);

        return InlineCodeParser.parse(context, codeExpressionSyntaxNodeFactory, codeValueSyntaxNodeFactory);
    }
}