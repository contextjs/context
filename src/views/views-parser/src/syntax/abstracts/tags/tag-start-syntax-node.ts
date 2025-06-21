/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { CompositeSyntaxNode, CompositeSyntaxNodeConstructor } from "../composite-syntax-node.js";

export type TagStartSyntaxNodeConstructor<TSyntaxNode extends TagStartSyntaxNode>
    = CompositeSyntaxNodeConstructor<TSyntaxNode>;

export abstract class TagStartSyntaxNode extends CompositeSyntaxNode { }