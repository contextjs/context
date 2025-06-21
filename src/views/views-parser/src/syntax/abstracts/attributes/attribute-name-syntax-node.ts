/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { NameSyntaxNode, NameSyntaxNodeConstructor } from "../name.syntax-node.js";

export type AttributeNameSyntaxNodeConstructor<TSyntaxNode extends AttributeNameSyntaxNode>
    = NameSyntaxNodeConstructor<TSyntaxNode>;

export abstract class AttributeNameSyntaxNode extends NameSyntaxNode { }