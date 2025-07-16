/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { TriviaSyntaxNode } from "../../common/trivia-syntax-node.js";
import { CompositeSyntaxNode } from "../composite-syntax-node.js";
import { SyntaxNode } from "../syntax-node.js";

export type AttributeValueSyntaxNodeFactory<TSyntaxNode extends AttributeValueSyntaxNode>
    = (
        attributeName: string,
        children: SyntaxNode[],
        leadingTrivia: TriviaSyntaxNode | null,
        trailingTrivia: TriviaSyntaxNode | null
    ) => TSyntaxNode;

export abstract class AttributeValueSyntaxNode extends CompositeSyntaxNode {
    public readonly attributeName: string;

    constructor(
        attributeName: string,
        children: SyntaxNode[],
        leadingTrivia: TriviaSyntaxNode | null = null,
        trailingTrivia: TriviaSyntaxNode | null = null) {
        super(children, leadingTrivia, trailingTrivia);
        this.attributeName = attributeName;
    }
}