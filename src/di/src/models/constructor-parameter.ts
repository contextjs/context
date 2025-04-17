/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

export class ConstructorParameter {
    public readonly name: string;
    public readonly type: any;

    public constructor(name: string, type: any) {
        this.name = name;
        this.type = type;
    }
}