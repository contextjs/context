/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { TransitionSyntaxNode } from "../../common/transition-syntax-node.js";
import { TriviaSyntaxNode } from "../../common/trivia-syntax-node.js";
import { BraceSyntaxNode } from "../brace-syntax-node.js";
import { CompositeSyntaxNode } from "../composite-syntax-node.js";
import { SyntaxNode } from "../syntax-node.js";

export type CodeBlockSyntaxNodeFactory<TSyntaxNode extends CodeBlockSyntaxNode>
    = (
        transition: TransitionSyntaxNode,
        openingBrace: BraceSyntaxNode,
        children: SyntaxNode[],
        closingBrace: BraceSyntaxNode,
        leadingTrivia?: TriviaSyntaxNode | null,
        trailingTrivia?: TriviaSyntaxNode | null
    ) => TSyntaxNode;

export abstract class CodeBlockSyntaxNode extends CompositeSyntaxNode {
    public readonly transition: TransitionSyntaxNode;
    public readonly openingBrace: BraceSyntaxNode
    public readonly closingBrace: BraceSyntaxNode;

    public constructor(
        transition: TransitionSyntaxNode,
        openingBrace: BraceSyntaxNode,
        children: SyntaxNode[],
        closingBrace: BraceSyntaxNode,
        leadingTrivia?: TriviaSyntaxNode | null,
        trailingTrivia?: TriviaSyntaxNode | null) {
        super(children, leadingTrivia, trailingTrivia);
        this.transition = transition;
        this.openingBrace = openingBrace;
        this.closingBrace = closingBrace;
    }
}