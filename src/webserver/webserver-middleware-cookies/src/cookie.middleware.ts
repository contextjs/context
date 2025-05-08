/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ObjectExtensions } from "@contextjs/system";
import { IHttpContext, IMiddleware } from "@contextjs/webserver";
import { CookieCollection } from "./models/cookie.collection.js";

export class CookieMiddleware implements IMiddleware {
    public name: string = "CookiesMiddleware";
    public version: string = "1.0.0";
    public description: string = "Middleware for handling cookies in HTTP requests and responses.";

    public async onRequestAsync(httpContext: IHttpContext, next: () => Promise<void>): Promise<void> {
        if (httpContext.request.url == "/favicon.ico" || httpContext.request.httpMethod?.toLowerCase() == "options")
            return;
        console.log("1");

        httpContext.response.cookies = new CookieCollection();
        console.log("2");
        httpContext.response.onEndAsync.add(this.endAsync.bind(this));
        console.log("3");
        this.parseRequestCookies(httpContext);
        console.log("4");

        await next();
    }

    private parseRequestCookies(httpContext: IHttpContext): void {
        var result = new CookieCollection();
        console.log("3.1");
        const cookieHeader = httpContext.request.headers.find(t => t.name == "cookie")
        console.log("3.2");
        if (ObjectExtensions.isNullOrUndefined(cookieHeader))
            return

        console.log("3.3");
        console.log(cookieHeader);
        console.log("3.4");

        let cookiesArray: string[] = cookieHeader.value instanceof String
            ? (cookieHeader.value as string).split(";")
            : cookieHeader.value instanceof Array
                ? cookieHeader.value as string[]
                : [cookieHeader.value as string];

        // cookiesArray.forEach((element: string) => {
        //     var m = / *([^=]+)=(.*)/.exec(element);
        //     if (m) {
        //         result.set(m[1], decodeURIComponent(m[2]));
        //     }
        // });

        httpContext.request.cookies = result;
        console.log("3.5");
    }

    private async endAsync(httpContext: IHttpContext): Promise<void> {
        var cookiesArray: string[] = [];

        for (let cookie of httpContext.response.cookies.values()) {
            cookiesArray.push(cookie.toString());
        }

        if (cookiesArray.length > 0) {
            httpContext.response.setHeader("Set-Cookie", cookiesArray);
        }
        console.log("5");
    }
}
