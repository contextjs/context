/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { StringExtensions, Throw } from "@contextjs/system";
import { CookieOptions } from "./cookie.options.js";

export class Cookie {

    public name: string;
    public value: string;
    public options: CookieOptions;

    public constructor(name: string);
    public constructor(name: string, value: string);
    public constructor(name: string, value: string, options?: CookieOptions);
    public constructor(name: string, value?: string, options?: CookieOptions) {
        Throw.ifNullOrWhiteSpace(name);

        this.name = name;
        this.value = value ?? StringExtensions.empty;
        this.options = options ?? new CookieOptions();
    }
}