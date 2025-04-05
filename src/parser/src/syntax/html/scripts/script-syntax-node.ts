/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { SyntaxNode } from "../../abstracts/syntax-node.js";

export class ScriptSyntaxNode extends SyntaxNode {
    public start: SyntaxNode;
    public content: SyntaxNode;
    public end: SyntaxNode;

    constructor(start: SyntaxNode, content: SyntaxNode, end: SyntaxNode, suffix: SyntaxNode | null) {
        super(suffix);
        this.start = start;
        this.content = content;
        this.end = end;
    }
}