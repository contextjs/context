/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { TriviaSyntaxNode } from "../common/trivia-syntax-node.js";

export type SyntaxNodeFactory<TSyntaxNode extends SyntaxNode>
    = (leadingTrivia?: TriviaSyntaxNode | null, trailingTrivia?: TriviaSyntaxNode | null) => TSyntaxNode;

export abstract class SyntaxNode {
    public leadingTrivia: TriviaSyntaxNode | null;
    public trailingTrivia: TriviaSyntaxNode | null;

    public constructor(
        leadingTrivia: TriviaSyntaxNode | null = null,
        trailingTrivia: TriviaSyntaxNode | null = null) {
        this.leadingTrivia = leadingTrivia;
        this.trailingTrivia = trailingTrivia;
    }
}