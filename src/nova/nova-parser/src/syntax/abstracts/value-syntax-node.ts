/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Location } from "../../sources/location.js";
import { TriviaSyntaxNode } from "../common/trivia-syntax-node.js";
import { LocationSyntaxNode, LocationSyntaxNodeConstructor } from "./location-syntax-node.js";

export type ValueSyntaxNodeConstructor<TSyntaxNode extends ValueSyntaxNode>
    = new (value: string | null, location: Location, trivia?: TriviaSyntaxNode | null) => TSyntaxNode;

export abstract class ValueSyntaxNode extends LocationSyntaxNode {
    public readonly value: string | null;

    public constructor(value: string | null, location: Location, trivia: TriviaSyntaxNode | null = null) {
        super(location, trivia);
        this.value = value;
    }
}