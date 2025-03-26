/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

export class FileTemplate {
    public readonly name: string;
    public content: string | null;

    constructor(name: string, content: string | null = null) {
        this.name = name;
        this.content = content;
    }
}