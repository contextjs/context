/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Location } from "../../sources/location.js";
import { LocationSyntaxNode } from "./location-syntax-node.js";
import { SyntaxNode } from "./syntax-node.js";

export abstract class ValueSyntaxNode extends LocationSyntaxNode {
    public readonly value: string | null;

    public constructor(value: string | null, location: Location, suffix: SyntaxNode | null = null) {
        super(location, suffix);
        this.value = value;
    }
}