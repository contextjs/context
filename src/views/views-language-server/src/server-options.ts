/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

export class ServerOptions {
    public readonly stdio: boolean;
    public readonly language: string;

    public constructor(stdio: boolean, language: string) {
        this.stdio = stdio;
        this.language = language;
    }
}