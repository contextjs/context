/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { PathMapping } from "./path-mapping.js";
import { PathOperationType } from "./path-operation-type.js";

export class PathOperation extends PathMapping {
    public readonly type: PathOperationType;

    public constructor(
        source: string,
        destination: string,
        type: PathOperationType) {
        super(source, destination);
        this.type = type;
    }
}