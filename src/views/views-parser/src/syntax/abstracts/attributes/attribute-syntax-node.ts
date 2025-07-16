/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { CompositeSyntaxNode, CompositeSyntaxNodeFactory } from "../composite-syntax-node.js";

export type AttributeSyntaxNodeFactory<TSyntaxNode extends AttributeSyntaxNode>
    = CompositeSyntaxNodeFactory<TSyntaxNode>;

export abstract class AttributeSyntaxNode extends CompositeSyntaxNode { }