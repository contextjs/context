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
 * Augments the core WebServerOptions with cookie support.
 */
declare module "@contextjs/webserver" {
    /**
     * Adds cookie parsing and response-cooking middleware to the pipeline.
     * @returns The WebServerOptions instance for chaining.
     */
    export interface WebServerOptions {
        useCookies(): WebServerOptions;
    }

    /**
     * HTTP request interface extended to expose parsed cookies.
     */
    export interface Request {
        /**
         * Collection of cookies sent by the client.
         */
        cookies: CookieCollection;
    }

    /**
     * HTTP response interface extended to allow setting cookies.
     */
    export interface Response {
        /**
         * Collection of cookies to be included in the response.
         */
        cookies: CookieCollection;
    }
}

/**
 * A dictionary of Cookie instances, keyed by cookie name.
 * When a cookie is deleted, its expires date is set to the epoch (Date(0)).
 */
export declare class CookieCollection extends Dictionary<string, Cookie> { }

/**
 * Represents a single HTTP cookie, including its name, value, and options.
 */
export declare class Cookie {
    /**
     * The cookie name (case-sensitive).
     */
    public name: string;

    /**
     * The cookie value.
     */
    public value: string;

    /**
     * The cookie attributes (domain, path, maxAge, etc.).
     */
    public options: CookieOptions;

    /**
     * Creates a new Cookie with the given name. Value defaults to empty string.
     * @param name The cookie name. Must be a non-empty, non-whitespace string.
     */
    public constructor(name: string);

    /**
     * Creates a new Cookie with the given name and value.
     * @param name The cookie name.
     * @param value The cookie value.
     */
    public constructor(name: string, value: string);

    /**
     * Creates a new Cookie with custom options.
     * @param name The cookie name.
     * @param value The cookie value.
     * @param options Additional cookie attributes (e.g., domain, path, secure).
     */
    public constructor(name: string, value: string, options?: CookieOptions);

    /**
     * Creates a new Cookie. Value and options are optional.
     * @param name The cookie name.
     * @param value The cookie value (defaults to '').
     * @param options The cookie options (defaults to sensible defaults).
     */
    public constructor(name: string, value?: string, options?: CookieOptions);
}

/**
 * Defines the attributes that control cookie behavior and scope.
 */
export declare class CookieOptions {
    /**
     * @param domain Restricts the cookie to a specific domain (host-only if null).
     * @param path URL path under which the cookie is valid (defaults to '/').
     * @param expires Absolute expiration date; session cookie if null.
     * @param secure When true, cookie is only sent over HTTPS.
     * @param sameSite Controls cross-site sending behavior (None, Lax, Strict).
     * @param httpOnly When true, cookie is inaccessible to client-side scripts.
     * @param maxAge Lifetime in seconds; takes precedence over expires if set.
     */
    public constructor(
        domain: string | null,
        path: string | null,
        expires: Date | null,
        secure: boolean | null,
        sameSite: SameSiteMode | null,
        httpOnly: boolean | null,
        maxAge: number | null
    );
}

/**
 * Controls how cookies are sent on cross-site requests.
 */
export declare enum SameSiteMode {
    /**
     * Cookie is sent on all requests (insecure default; requires Secure in modern browsers).
     */
    None,

    /**
     * Cookie is withheld on cross-site subrequests (e.g., images), but sent on top-level navigation GETs.
     */
    Lax,

    /**
     * Cookie is sent only when the origin matches (strict same-site policy).
     */
    Strict
}