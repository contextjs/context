/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { DelimiterSyntaxNode, DelimiterSyntaxNodeFactory } from "../abstracts/delimiter-syntax-node.js";

export type BracketSyntaxNodeFactory<TSyntaxNode extends BracketSyntaxNode>
    = DelimiterSyntaxNodeFactory<TSyntaxNode>;

export abstract class BracketSyntaxNode extends DelimiterSyntaxNode { }