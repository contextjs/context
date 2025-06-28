/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Location } from "@contextjs/views";
import { TriviaSyntaxNode } from "../common/trivia-syntax-node.js";
import { SyntaxNode } from "./syntax-node.js";

export type LocationSyntaxNodeConstructor<TSyntaxNode extends LocationSyntaxNode>
    = new (location: Location, leadingTrivia?: TriviaSyntaxNode | null, trailingTrivia?: TriviaSyntaxNode | null) => TSyntaxNode;

export abstract class LocationSyntaxNode extends SyntaxNode {
    public readonly location: Location;

    public constructor(
        location: Location,
        leadingTrivia: TriviaSyntaxNode | null = null,
        trailingTrivia: TriviaSyntaxNode | null = null) {
        super(leadingTrivia, trailingTrivia);
        this.location = location;
    }
}