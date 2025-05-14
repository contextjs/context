/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { WebServerOptions } from "@contextjs/webserver";
import { CookieMiddleware } from "../cookie.middleware.js";
import { CookieCollection } from "../models/cookie.collection.js";

declare module "@contextjs/webserver" {
    export interface Request {
        cookies: CookieCollection;
    }

    export interface Response {
        cookies: CookieCollection;
    }

    export interface WebServerOptions {
        useCookies(): WebServerOptions;
    }
}

WebServerOptions.prototype.useCookies = function (): WebServerOptions {
    this.useMiddleware(new CookieMiddleware());

    return this;
};