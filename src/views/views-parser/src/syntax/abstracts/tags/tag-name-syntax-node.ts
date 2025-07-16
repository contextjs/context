/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { NameSyntaxNode, NameSyntaxNodeFactory } from "../name-syntax-node.js";

export type TagNameSyntaxNodeFactory<TSyntaxNode extends TagNameSyntaxNode>
    = NameSyntaxNodeFactory<TSyntaxNode>;

export abstract class TagNameSyntaxNode extends NameSyntaxNode { }