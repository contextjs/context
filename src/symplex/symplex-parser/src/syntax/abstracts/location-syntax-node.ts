/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Location } from "../../sources/location.js";
import { SyntaxNode } from "./syntax-node.js";

export abstract class LocationSyntaxNode extends SyntaxNode {
    public location: Location;

    public constructor(location: Location, suffix: SyntaxNode | null = null) {
        super(suffix);
        this.location = location
    }
}