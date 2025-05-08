import { CookieCollection } from "../models/cookie.collection.js";

declare module "@contextjs/webserver" {
    export interface IHttpResponse {
        /**
         * Gets the IHttpResponse Cookies
         */
        cookies: CookieCollection;
    }
}