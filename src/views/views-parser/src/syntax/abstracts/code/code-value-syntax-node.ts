/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ValueSyntaxNode, ValueSyntaxNodeFactory } from "../value-syntax-node.js";

export type CodeValueSyntaxNodeFactory<TSyntaxNode extends CodeValueSyntaxNode>
    = ValueSyntaxNodeFactory<TSyntaxNode>;

export abstract class CodeValueSyntaxNode extends ValueSyntaxNode { }