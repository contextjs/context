/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { SyntaxNode } from "./abstracts/syntax-node.js";

export class CompositeSyntaxNode extends SyntaxNode {
    public readonly children: SyntaxNode[];

    public constructor(children: SyntaxNode[]) {
        super();
        this.children = children;
    }
}