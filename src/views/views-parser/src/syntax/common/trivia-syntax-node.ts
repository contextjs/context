/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Location } from "../../sources/location.js";
import { ValueSyntaxNode } from "../abstracts/value-syntax-node.js";

export class TriviaSyntaxNode extends ValueSyntaxNode {
    public constructor(value: string | null, location: Location) {
        super(value, location);
    }
}