/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Dictionary } from "@contextjs/collections";
import "@contextjs/webserver";

/**
 * Extends the WebServerOptions interface with a method to serve static files.
 */
declare module "@contextjs/webserver" {
    export interface WebServerOptions {
        useCookies(): WebServerOptions;
    }
    export interface IHttpRequest {
        cookies: CookieCollection;
    }
    export interface IHttpResponse {
        cookies: CookieCollection;
    }
}

export declare class CookieCollection extends Dictionary<string, Cookie> { }

export declare class Cookie {

    public name: string;
    public value: string;
    public options: CookieOptions;

    public constructor(name: string);
    public constructor(name: string, value: string);
    public constructor(name: string, value: string, options?: CookieOptions);
    public constructor(name: string, value?: string, options?: CookieOptions);
}

export declare class CookieOptions {
    /**
     * Gets or sets the public folder from which static files are served.
     * Defaults to `"public"`.
     */
    public publicFolder: string;

    /**
     * Gets or sets the list of allowed file extensions.
     * If empty, all file types are allowed.
     */
    public fileExtensions: string[];
}
