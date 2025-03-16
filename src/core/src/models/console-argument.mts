/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/context-js/context/blob/main/LICENSE
 */

export class ConsoleArgument {
    public readonly name: string;
    public readonly values: string[]

    constructor(name: string, values: string[]) {
        this.name = name;
        this.values = values;
    }
}