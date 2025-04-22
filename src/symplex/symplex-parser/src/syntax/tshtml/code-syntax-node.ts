/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { SyntaxNode } from "../abstracts/syntax-node.js";
import { TypescriptSyntaxNode } from "../typescript/typescript-syntax-node.js";

export class CodeSyntaxNode extends TypescriptSyntaxNode {

    public codeKeyword: SyntaxNode;

    constructor(
        transition: SyntaxNode,
        codeKeyword: SyntaxNode,
        openBrace: SyntaxNode,
        value: SyntaxNode,
        closeBrace: SyntaxNode,
        suffix: SyntaxNode | null) {
        super(transition, openBrace, value, closeBrace, suffix);
        this.codeKeyword = codeKeyword;
    }
}