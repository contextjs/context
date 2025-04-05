/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { SyntaxNode } from "../abstracts/syntax-node.js";

export class InlineTypescriptSyntaxNode extends SyntaxNode {
    public transition: SyntaxNode;
    public value: SyntaxNode;

    constructor(transition: SyntaxNode, value: SyntaxNode, suffix: SyntaxNode | null) {
        super(suffix);
        this.transition = transition;
        this.value = value;
    }
}