/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { DelimiterSyntaxNode, DelimiterSyntaxNodeConstructor } from "../abstracts/delimiter-syntax-node.js";

export type BraceSyntaxNodeConstructor<TSyntaxNode extends BraceSyntaxNode>
    = DelimiterSyntaxNodeConstructor<TSyntaxNode>;

export abstract class BraceSyntaxNode extends DelimiterSyntaxNode { }