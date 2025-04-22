/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { SyntaxNode } from "../abstracts/syntax-node.js";

export class HtmlTagSyntaxNode extends SyntaxNode {
    public name: string = '';
    public selfClosing: boolean = false;

    public startTag: SyntaxNode;
    public children: SyntaxNode[];
    public endTag: SyntaxNode | null = null;

    constructor(
        startTag: SyntaxNode,
        children: SyntaxNode[],
        endTag: SyntaxNode | null,
        suffix: SyntaxNode | null) {
        super(suffix);
        this.startTag = startTag;
        this.children = children;
        this.endTag = endTag;
    }
}