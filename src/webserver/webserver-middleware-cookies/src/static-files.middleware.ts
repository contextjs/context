/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { File } from "@contextjs/io";
import { StringExtensions } from "@contextjs/system";
import { IHttpContext, IMiddleware, MimeTypes } from "@contextjs/webserver";
import path from "node:path";

export class StaticFilesMiddleware implements IMiddleware {
    public name: string = "StaticFilesMiddleware";
    public version: string = "1.0.0";
    public publicFolder: string = "public";
    public fileExtensions: string[] = [];

    public async onRequestAsync(httpContext: IHttpContext, next: () => Promise<void>): Promise<void> {
        const requestUrl = httpContext.request.url;
        if (StringExtensions.isNullOrWhiteSpace(requestUrl)) {
            httpContext.response.statusCode = 500;
            httpContext.response.write("Internal Server Error: Invalid request URL.");
            return;
        }

        const safeUrl = path.normalize(requestUrl).replace(/^(\.\.[\/\\])+/, '');
        const fileExtension = path.extname(safeUrl).slice(1).toLowerCase();

        if (this.fileExtensions.length > 0 && !this.fileExtensions.includes(fileExtension))
            return await next();

        const filePath = path.join(this.publicFolder, safeUrl);
        if (!File.exists(filePath))
            return await next();

        const mimeType = MimeTypes.get(fileExtension) ?? "text/plain";
        httpContext.response.setHeader("Content-Type", mimeType);

        await httpContext.response.streamAsync(filePath);
    }
}
