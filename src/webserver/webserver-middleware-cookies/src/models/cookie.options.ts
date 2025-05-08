/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { SameSiteMode } from "./same-site-mode.js";

export class CookieOptions {
    public constructor(
        public domain: string | null = null,
        public path: string = '/',
        public expires: Date | null = null,
        public secure: boolean = false,
        public sameSite: SameSiteMode = SameSiteMode.None,
        public httpOnly: boolean = false,
        public maxAge: number | null = null) { }
}