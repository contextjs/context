import { CookieCollection } from "../models/cookie.collection.js";

declare module "@contextjs/webserver" {
    export interface Request {
        /**
         * Gets the Request Cookies
         */
        cookies: CookieCollection;
    }
}