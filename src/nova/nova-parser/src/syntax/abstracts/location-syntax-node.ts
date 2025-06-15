/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Location } from "../../sources/location.js";
import { TriviaSyntaxNode } from "../common/trivia-syntax-node.js";
import { SyntaxNode } from "./syntax-node.js";

export type LocationSyntaxNodeConstructor<TSyntaxNode extends LocationSyntaxNode>
    = new (location: Location, trivia?: TriviaSyntaxNode | null) => TSyntaxNode;

export abstract class LocationSyntaxNode extends SyntaxNode {
    public readonly location: Location;

    public constructor(location: Location, trivia: TriviaSyntaxNode | null = null) {
        super(trivia);
        this.location = location;
    }
}