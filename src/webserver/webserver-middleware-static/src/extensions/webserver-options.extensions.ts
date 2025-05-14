/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ObjectExtensions } from "@contextjs/system";
import { WebServerOptions } from "@contextjs/webserver";
import { StaticFilesMiddleware } from "../static-files.middleware.js";
import { StaticFilesOptions } from "./static-files.options.js";

declare module "@contextjs/webserver" {
    export interface WebServerOptions {
        useStaticFiles(configure: (staticFilesOptions: StaticFilesOptions) => void): WebServerOptions;
    }
}

WebServerOptions.prototype.useStaticFiles = function (configure: (staticFilesOptions: StaticFilesOptions) => void): WebServerOptions {
    const staticFilesOptions = new StaticFilesOptions();

    if (!ObjectExtensions.isNullOrUndefined(configure))
        configure(staticFilesOptions);

    const staticFilesMiddleware = new StaticFilesMiddleware();
    staticFilesMiddleware.publicFolder = staticFilesOptions.publicFolder;
    staticFilesMiddleware.fileExtensions = staticFilesOptions.fileExtensions;

    this.webServer.useMiddleware(staticFilesMiddleware);

    return this;
};