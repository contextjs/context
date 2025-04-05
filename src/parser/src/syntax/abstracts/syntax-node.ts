/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

export abstract class SyntaxNode {
    public suffix: SyntaxNode | null = null;

    public constructor(suffix: SyntaxNode | null = null) {
        this.suffix = suffix
    }
}