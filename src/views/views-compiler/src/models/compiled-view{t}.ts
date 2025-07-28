/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Diagnostic } from "@contextjs/views";

export class CompiledView<T = unknown> {
    public readonly filePath: string;
    public readonly kind: string;
    public readonly diagnostics: Diagnostic[];
    public readonly data: T;

    public constructor(
        filePath: string,
        kind: string,
        diagnostics: Diagnostic[],
        data: T) {
        this.filePath = filePath;
        this.kind = kind;
        this.data = data;
        this.diagnostics = diagnostics ?? [];
    }
}