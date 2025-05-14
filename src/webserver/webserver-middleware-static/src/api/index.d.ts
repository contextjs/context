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
        useStaticFiles(configure: (staticFilesOptions: StaticFilesOptions) => void): WebServerOptions;
    }
}

export declare class StaticFilesOptions {
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
