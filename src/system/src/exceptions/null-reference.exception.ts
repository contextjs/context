/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ObjectExtensions } from "../extensions/object.extensions.js";
import { StringExtensions } from "../extensions/string.extensions.js";
import { SystemException } from "./system.exception.js";

export class NullReferenceException extends SystemException {
    public constructor(message?: string, options?: ErrorOptions) {
        super(message ?? "The specified reference is null or undefined.", options);
        this.name = NullReferenceException.name;
    }

    public static throwIfNull(value: any): void {
        if (ObjectExtensions.isNull(value))
            throw new NullReferenceException();
    }

    public static throwIfNullOrUndefined(value: any): void {
        if (ObjectExtensions.isNullOrUndefined(value))
            throw new NullReferenceException();
    }

    public static throwIfNullOrEmpty(value: string | null | undefined): void {
        if (StringExtensions.isNullOrEmpty(value))
            throw new NullReferenceException();
    }

    public static throwIfNullOrWhitespace(value: string | null | undefined): void {
        if (StringExtensions.isNullOrWhitespace(value))
            throw new NullReferenceException();
    }
}