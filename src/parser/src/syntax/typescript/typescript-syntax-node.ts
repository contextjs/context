/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { SyntaxNode } from "../abstracts/syntax-node.js";

export class TypescriptSyntaxNode extends SyntaxNode {
    public transition: SyntaxNode;
    public openBrace: SyntaxNode;
    public value: SyntaxNode;
    public closeBrace: SyntaxNode;

    constructor(
        transition: SyntaxNode,
        openBrace: SyntaxNode,
        value: SyntaxNode,
        closeBrace: SyntaxNode,
        suffix: SyntaxNode | null) {
        super(suffix);
        this.transition = transition;
        this.openBrace = openBrace;
        this.value = value;
        this.closeBrace = closeBrace;
    }
}