/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { NameSyntaxNode, NameSyntaxNodeFactory } from "../name-syntax-node.js";

export type AttributeNameSyntaxNodeFactory<TSyntaxNode extends AttributeNameSyntaxNode>
    = NameSyntaxNodeFactory<TSyntaxNode>;

export abstract class AttributeNameSyntaxNode extends NameSyntaxNode { }