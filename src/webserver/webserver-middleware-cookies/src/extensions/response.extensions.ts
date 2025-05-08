import { CookieCollection } from "../models/cookie.collection.js";

declare module "@contextjs/webserver" {
    export interface Response {
        /**
         * Gets the Response Cookies
         */
        cookies: CookieCollection;
    }
}