/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { CompositeSyntaxNode, CompositeSyntaxNodeConstructor } from "../composite-syntax-node.js";

export type AttributeSyntaxNodeConstructor<TSyntaxNode extends AttributeSyntaxNode>
    = CompositeSyntaxNodeConstructor<TSyntaxNode>;

export abstract class AttributeSyntaxNode extends CompositeSyntaxNode { }