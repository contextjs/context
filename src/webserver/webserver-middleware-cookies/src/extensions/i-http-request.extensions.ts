import { CookieCollection } from "../models/cookie.collection.js";

declare module "@contextjs/webserver" {
    export interface IHttpRequest {
        /**
         * Gets the IHttpRequest Cookies
         */
        cookies: CookieCollection;
    }
}