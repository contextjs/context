/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { File } from "@contextjs/io";
import { IHttpContext, IMiddleware, MimeTypes } from "@contextjs/webserver";
import path from "node:path";

export class StaticFilesMiddleware implements IMiddleware {
    public name: string = "StaticFilesMiddleware";
    public version: string = "1.0.0";
    public publicFolder: string = "public";
    public fileExtensions: string[] = [];

    public async onRequestAsync(httpContext: IHttpContext, next: () => Promise<void>): Promise<void> {
        if (!httpContext.request.url) {
            httpContext.response.statusCode = 500;
            httpContext.response.write("Internal Server Error: Invalid request URL.");
        }
        else {
            var safeUrl = path.normalize(httpContext.request.url).replace(/^(\.\.[\/\\])+/, '');
            let fileExtension = path.extname(safeUrl).slice(1);

            if (this.fileExtensions.length == 0 || this.fileExtensions.includes(fileExtension)) {
                const mimeType = fileExtension
                    ? MimeTypes.get(fileExtension) ?? "text/plain"
                    : "text/plain";
                httpContext.response.setHeader("Content-Type", mimeType);

                const filePath = path.join(this.publicFolder, safeUrl);
                if (File.exists(filePath))
                    await httpContext.response.streamAsync(filePath);
                else
                    httpContext.response.statusCode = 404;
            }
        }
    }
}