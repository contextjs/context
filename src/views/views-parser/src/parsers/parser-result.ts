/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Diagnostic } from "../diagnostics/diagnostic.js";
import { SyntaxNode } from "../syntax/abstracts/syntax-node.js";

export class ParserResult {
    public diagnostics: Diagnostic[] = [];
    public nodes: SyntaxNode[] = [];
}