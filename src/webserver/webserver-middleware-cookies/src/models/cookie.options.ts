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
        public secure: boolean = true,
        public sameSite: SameSiteMode = SameSiteMode.Lax,
        public httpOnly: boolean = true,
        public maxAge: number | null = null) { }

    public toString(): string {
        const parts: string[] = [];
        if (this.domain)
            parts.push(`Domain=${this.domain}`);
        if (this.path)
            parts.push(`Path=${this.path}`);
        if (this.expires)
            parts.push(`Expires=${this.expires.toUTCString()}`);
        if (this.maxAge != null)
            parts.push(`Max-Age=${this.maxAge}`);
        if (this.secure)
            parts.push('Secure');
        if (this.httpOnly)
            parts.push('HttpOnly');
        switch (this.sameSite) {
            case SameSiteMode.Lax:
                parts.push('SameSite=Lax');
                break;
            case SameSiteMode.Strict:
                parts.push('SameSite=Strict');
                break;
            default:
                parts.push('SameSite=None');
        }
        return parts.join('; ');
    }
}