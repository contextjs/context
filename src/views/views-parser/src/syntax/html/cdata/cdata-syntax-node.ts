/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { SyntaxNode } from "../../abstracts/syntax-node.js";
import { TriviaSyntaxNode } from "../../common/trivia-syntax-node.js";

export class CDATASyntaxNode extends SyntaxNode {
    public readonly start: SyntaxNode;
    public readonly content: SyntaxNode;
    public readonly end: SyntaxNode;

    constructor(
        start: SyntaxNode,
        content: SyntaxNode,
        end: SyntaxNode,
        leadingTrivia: TriviaSyntaxNode | null = null,
        trailingTrivia: TriviaSyntaxNode | null = null) {
        super(leadingTrivia, trailingTrivia);
        this.start = start;
        this.content = content;
        this.end = end;
    }
}