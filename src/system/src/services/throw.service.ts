/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { NullReferenceException } from "../exceptions/null-reference.exception.js";
import { ObjectExtensions } from "../extensions/object.extensions.js";
import { StringExtensions } from "../extensions/string.extensions.js";

export class Throw {
    public static ifNull(value: any): void {
        if (ObjectExtensions.isNull(value))
            throw new NullReferenceException();
    }

    public static ifNullOrUndefined(value: any): void {
        if (ObjectExtensions.isNullOrUndefined(value))
            throw new NullReferenceException();
    }

    public static ifNullOrEmpty(value: string | null | undefined): void {
        if (StringExtensions.isNullOrEmpty(value))
            throw new NullReferenceException();
    }

    public static ifNullOrWhitespace(value: string | null | undefined): void {
        if (StringExtensions.isNullOrWhitespace(value))
            throw new NullReferenceException();
    }
}