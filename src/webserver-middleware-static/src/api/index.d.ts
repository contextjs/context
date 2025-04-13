/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import "@contextjs/webserver";

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