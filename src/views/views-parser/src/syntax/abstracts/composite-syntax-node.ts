/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { TriviaSyntaxNode } from "../common/trivia-syntax-node.js";
import { SyntaxNode } from "./syntax-node.js";

export type CompositeSyntaxNodeConstructor<TSyntaxNode extends CompositeSyntaxNode>
    = new (children: SyntaxNode[], leadingTrivia?: TriviaSyntaxNode | null, trailingTrivia?: TriviaSyntaxNode | null) => TSyntaxNode;

export abstract class CompositeSyntaxNode extends SyntaxNode {
    public readonly children: SyntaxNode[];

    public constructor(
        children: SyntaxNode[],
        leadingTrivia: TriviaSyntaxNode | null = null,
        trailingTrivia: TriviaSyntaxNode | null = null) {
        super(leadingTrivia, trailingTrivia);
        this.children = children;
    }
}