/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

export class DiagnosticMessage {
    public readonly code: number;
    public readonly message: string;

    public constructor(code: number, message: string) {
        this.code = code;
        this.message = message;
    }
}