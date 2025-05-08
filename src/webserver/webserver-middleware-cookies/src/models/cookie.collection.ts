/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Dictionary } from "@contextjs/collections";
import { Cookie } from "./cookie.js";

export class CookieCollection extends Dictionary<string, Cookie> {
    public override delete(key: string): void {
        const cookie = this.get(key);
        if (cookie) {
            cookie.options.expires = new Date(0);
            super.set(key, cookie);
        }
    }
}