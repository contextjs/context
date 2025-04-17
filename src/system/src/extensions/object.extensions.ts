/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

export class ObjectExtensions {
    public static isNull(value: unknown): value is null {
        return value === null;
    }

    public static isUndefined(value: unknown): value is undefined {
        return value === undefined;
    }

    public static isNullOrUndefined<T>(value: T | null | undefined): value is null | undefined {
        return value === null || value === undefined;
    }
}