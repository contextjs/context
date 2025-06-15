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
    = new (children: SyntaxNode[], trivia?: TriviaSyntaxNode | null) => TSyntaxNode;

export abstract class CompositeSyntaxNode extends SyntaxNode {
    public readonly children: SyntaxNode[];

    public constructor(children: SyntaxNode[], trivia: TriviaSyntaxNode | null = null) {
        super(trivia);
        this.children = children;
    }
}