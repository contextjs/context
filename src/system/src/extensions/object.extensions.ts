/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

export class ObjectExtensions {
    public static isNullOrUndefined(value: any): boolean {
        return this.isNull(value) || this.isUndefined(value);
    }

    public static isNull(value: any): boolean {
        return value === null;
    }

    public static isUndefined(value: any): boolean {
        return value === undefined;
    }
}