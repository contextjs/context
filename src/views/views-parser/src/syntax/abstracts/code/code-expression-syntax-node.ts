/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Location } from "@contextjs/views";

import { TransitionSyntaxNode } from "../../common/transition-syntax-node.js";
import { TriviaSyntaxNode } from "../../common/trivia-syntax-node.js";
import { SyntaxNode } from "../syntax-node.js";
import { CodeValueSyntaxNode } from "./code-value-syntax-node.js";

export type CodeExpressionSyntaxNodeFactory<TSyntaxNode extends CodeExpressionSyntaxNode>
    = (
        transition: TransitionSyntaxNode,
        value: CodeValueSyntaxNode,
        leadingTrivia?: TriviaSyntaxNode | null,
        trailingTrivia?: TriviaSyntaxNode | null
    ) => TSyntaxNode;

export abstract class CodeExpressionSyntaxNode extends SyntaxNode {
    public readonly transition: TransitionSyntaxNode;
    public readonly value: CodeValueSyntaxNode;

    public constructor(
        transition: TransitionSyntaxNode,
        value: CodeValueSyntaxNode,
        leadingTrivia: TriviaSyntaxNode | null = null,
        trailingTrivia: TriviaSyntaxNode | null = null) {
        super(leadingTrivia, trailingTrivia);
        this.transition = transition;
        this.value = value;
    }
}