/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { IHttpContext, IMiddleware } from "@contextjs/webserver";

/**
 * Extends the WebServerOptions interface with a method to serve static files.
 */
declare module "@contextjs/webserver" {
    export interface WebServerOptions {
        useStaticFiles(options: (staticFilesOptions: StaticFilesOptions) => void): WebServerOptions;
    }
}

/**
 * Static files middleware options
 */
export declare class StaticFilesOptions {

    /**
     * Get or set the public folder. Default is "public"
     */
    public publicFolder: string;

    /**
     * Get or set the file extensions. If empty, the middleware will serve all files.
     */
    public fileExtensions: string[];
}

/**
 * Middleware to serve static files.
 */
export declare class StaticFilesMiddleware implements IMiddleware {
    /**
     * The name of the middleware.
     */
    public name: string;

    /**
     * The version of the middleware.
     */
    public version: string;

    /**
     * The folder that contains the static files.
     */
    public publicFolder: string;

    /**
     * Creates a new instance of the StaticFilesMiddleware class.
     * @param publicFolder The folder that contains the static files. Default is "public".
     */
    public constructor(publicFolder: string);

    /**
     * Handles the request to serve the static files.
     * @param httpContext The HTTP context.
     * @param next The next middleware
     * @returns A promise that represents the asynchronous operation.
     */
    public onRequestAsync(httpContext: IHttpContext, next: () => Promise<void>): Promise<void>;
}