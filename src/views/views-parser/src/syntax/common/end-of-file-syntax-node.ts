/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Location } from "@contextjs/views";
import { LocationSyntaxNode } from "../abstracts/location-syntax-node.js";
import { TriviaSyntaxNode } from "../common/trivia-syntax-node.js";

export class EndOfFileSyntaxNode extends LocationSyntaxNode {
    public static readonly endOfFile: string = "\0";

    public constructor(location: Location, leadingTrivia: TriviaSyntaxNode | null = null) {
        super(location, leadingTrivia);
    }
}