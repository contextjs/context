/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { SyntaxNode } from "../../abstracts/syntax-node.js";

export class AttributeSyntaxNode extends SyntaxNode {
    public name: SyntaxNode;
    public assignment: SyntaxNode | null = null;
    public startQuote: SyntaxNode | null = null;
    public value: SyntaxNode | null = null;
    public endQuote: SyntaxNode | null = null;

    public constructor(
        name: SyntaxNode,
        assignment: SyntaxNode | null = null,
        startQuote: SyntaxNode | null = null,
        value: SyntaxNode | null = null,
        endQuote: SyntaxNode | null = null,
        suffix: SyntaxNode | null = null) {
        super(suffix);
        this.name = name;
        this.assignment = assignment;
        this.value = value;
        this.startQuote = startQuote;
        this.endQuote = endQuote;
    }
}