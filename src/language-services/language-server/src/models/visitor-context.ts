/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { INodeVisitor } from "./i-node-visitor{t}.js";

export class VisitorContext {
    public readonly visitors: INodeVisitor<any>[];

    public constructor(visitors: INodeVisitor<any>[]) {
        this.visitors = visitors;
    }
}