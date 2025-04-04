/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { WebServerOptions } from "@contextjs/webserver";
import { StaticFilesMiddleware } from "../static-files.middleware.js";
import { StaticFilesOptions } from "../static-files.options.js";

declare module "@contextjs/webserver" {
    export interface WebServerOptions {
        useStaticFiles(options: (staticFilesOptions: StaticFilesOptions) => void): WebServerOptions;
    }
}

WebServerOptions.prototype.useStaticFiles = function (options: (staticFilesOptions: StaticFilesOptions) => void): WebServerOptions {
    const staticFilesOptions = new StaticFilesOptions();
    options(staticFilesOptions);

    const staticFilesMiddleware = new StaticFilesMiddleware();
    staticFilesMiddleware.publicFolder = staticFilesOptions.publicFolder;
    staticFilesMiddleware.fileExtensions = staticFilesOptions.fileExtensions;

    this.useMiddleware(staticFilesMiddleware);

    return this;
};