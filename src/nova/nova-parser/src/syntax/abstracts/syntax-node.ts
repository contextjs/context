/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { TriviaSyntaxNode } from "../common/trivia-syntax-node.js";

export type SyntaxNodeConstructor<TSyntaxNode extends SyntaxNode>
    = new (trivia?: TriviaSyntaxNode | null) => TSyntaxNode;

export abstract class SyntaxNode {
    public readonly trivia: TriviaSyntaxNode | null = null;

    public constructor(trivia: TriviaSyntaxNode | null = null) {
        this.trivia = trivia;
    }
}