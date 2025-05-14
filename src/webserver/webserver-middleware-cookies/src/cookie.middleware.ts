/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ObjectExtensions } from "@contextjs/system";
import { HttpContext, IMiddleware } from "@contextjs/webserver";
import { CookieCollection } from "./models/cookie.collection.js";
import { Cookie } from "./models/cookie.js";

export class CookieMiddleware implements IMiddleware {
    public name = "CookiesMiddleware";
    public version = "1.0.0";
    public description = "Middleware for handling cookies in HTTP requests and responses.";

    public async onRequest(httpContext: HttpContext, next: () => Promise<void>): Promise<void> {
        httpContext.request.cookies = new CookieCollection();
        httpContext.response.cookies = new CookieCollection();

        this.parseRequestCookies(httpContext);

        httpContext.response.onEnd(() => {
            for (const cookie of httpContext.response.cookies.values())
                httpContext.response.setHeader("Set-Cookie", cookie.toString());
        });

        await next();
    }

    private parseRequestCookies(httpContext: HttpContext): void {
        const cookieHeader = httpContext.request.headers.get("cookie");

        if (ObjectExtensions.isNullOrUndefined(cookieHeader))
            return;

        const result = new CookieCollection();

        for (const pair of cookieHeader.split(";")) {
            const index = pair.indexOf("=");
            const rawName = index >= 0 ? pair.slice(0, index) : pair;
            const rawValue = index >= 0 ? pair.slice(index + 1) : "";

            const name = rawName.trim();
            const value = rawValue.trim();

            if (name) {
                const decoded = decodeURIComponent(value);
                result.set(name, new Cookie(name, decoded));
            }
        }

        httpContext.request.cookies = result;
    }
}