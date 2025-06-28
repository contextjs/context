/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { CodeBlockSyntaxNode, CodeBlockSyntaxNodeConstructor } from "../../../api/index.js";
import { ParserContext } from "../../../context/parser-context.js";
import { BraceSyntaxNode, BraceSyntaxNodeConstructor } from "../../../syntax/abstracts/brace-syntax-node.js";
import { CodeExpressionSyntaxNode, CodeExpressionSyntaxNodeConstructor } from "../../../syntax/abstracts/code/code-expression-syntax-node.js";
import { CodeValueSyntaxNode, CodeValueSyntaxNodeConstructor } from "../../../syntax/abstracts/code/code-value-syntax-node.js";
import { BlockCodeParser } from "./block-code.parser.js";
import { InlineCodeParser } from "./inline-code.parser.js";

export class CodeParser {
    public static parse<
        TCodeBlockSyntaxNode extends CodeBlockSyntaxNode,
        TCodeExpressionSyntaxNode extends CodeExpressionSyntaxNode,
        TCodeValueSyntaxNode extends CodeValueSyntaxNode,
        TBraceSyntaxNode extends BraceSyntaxNode>(
            context: ParserContext,
            codeBlockSyntaxNode: CodeBlockSyntaxNodeConstructor<TCodeBlockSyntaxNode>,
            codeExpressionSyntaxNode: CodeExpressionSyntaxNodeConstructor<TCodeExpressionSyntaxNode>,
            codeValueSyntaxNode: CodeValueSyntaxNodeConstructor<TCodeValueSyntaxNode>,
            braceSyntaxNode: BraceSyntaxNodeConstructor<TBraceSyntaxNode>
        ): TCodeExpressionSyntaxNode | TCodeBlockSyntaxNode {

        if (context.nextCharacter === '{')
            return BlockCodeParser.parse(context, codeBlockSyntaxNode, codeValueSyntaxNode, braceSyntaxNode);

        return InlineCodeParser.parse(context, codeExpressionSyntaxNode, codeValueSyntaxNode);
    }
}