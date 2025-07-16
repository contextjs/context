/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Location } from "@contextjs/views";
import { TriviaSyntaxNode } from "../common/trivia-syntax-node.js";
import { LocationSyntaxNode } from "./location-syntax-node.js";

export type ValueSyntaxNodeFactory<TSyntaxNode extends ValueSyntaxNode>
    = (value: string | null, location: Location, leadingTrivia?: TriviaSyntaxNode | null, trailingTrivia?: TriviaSyntaxNode | null) => TSyntaxNode;

export abstract class ValueSyntaxNode extends LocationSyntaxNode {
    public readonly value: string | null;

    public constructor(
        value: string | null,
        location: Location,
        leadingTrivia: TriviaSyntaxNode | null = null,
        trailingTrivia: TriviaSyntaxNode | null = null) {
        super(location, leadingTrivia, trailingTrivia);
        this.value = value;
    }
}