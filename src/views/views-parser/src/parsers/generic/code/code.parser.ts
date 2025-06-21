/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ParserContextState } from "../../../context/parser-context-state.js";
import { ParserContext } from "../../../context/parser-context.js";
import { DiagnosticMessages } from "../../../diagnostics/diagnostic-messages.js";
import { CodeSyntaxNode, CodeSyntaxNodeConstructor } from "../../../syntax/abstracts/code/code-syntax-node.js";
import { CodeValueSyntaxNode, CodeValueSyntaxNodeConstructor } from "../../../syntax/abstracts/code/code-value-syntax-node.js";
import { TransitionParser } from "../../common/transition.parser.js";
import { TriviaParser } from "../../common/trivia.parser.js";
import { BlockCodeParser } from "./block-code.parser.js";
import { InlineCodeParser } from "./inline-code.parser.js";

export class CodeParser {
    public static parse<
        TCodeSyntaxNode extends CodeSyntaxNode,
        TCodeValueSyntaxNode extends CodeValueSyntaxNode>(
            context: ParserContext,
            codeSyntaxNode: CodeSyntaxNodeConstructor<TCodeSyntaxNode>,
            codeValueSyntaxNode: CodeValueSyntaxNodeConstructor<TCodeValueSyntaxNode>
        ): TCodeSyntaxNode {

        if (context.currentCharacter !== TransitionParser.transitionSymbol) {
            context.addErrorDiagnostic(DiagnosticMessages.ExpectedTransitionMarker(context.currentCharacter));
            return new codeSyntaxNode([], null, TriviaParser.parse(context));
        }

        if (context.nextCharacter === '{') {
            context.setState(ParserContextState.Code);
            return BlockCodeParser.parse(context, codeSyntaxNode, codeValueSyntaxNode);
        }

        return InlineCodeParser.parse(context, codeSyntaxNode, codeValueSyntaxNode);
    }
}