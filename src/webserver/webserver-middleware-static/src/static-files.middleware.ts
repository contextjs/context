/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { File } from "@contextjs/io";
import { StringExtensions } from "@contextjs/system";
import { HttpContext, IMiddleware } from "@contextjs/webserver";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";

export class StaticFilesMiddleware implements IMiddleware {
    public name: string = "StaticFilesMiddleware";
    public version: string = "1.0.0";
    public publicFolder: string = "public";
    public fileExtensions: string[] = [];

    public async onRequest(httpContext: HttpContext, next: () => Promise<void> | void): Promise<void> {
        const requestUrl = httpContext.request.path;
        if (StringExtensions.isNullOrWhiteSpace(requestUrl)) {
            httpContext.response.statusCode = 500;
            httpContext.response.send("Internal Server Error: Invalid request URL.");
            return;
        }

        const safeUrl = path.normalize(requestUrl).replace(/^(\.\.[\/\\])+/, '');
        const fileExtension = path.extname(safeUrl).slice(1).toLowerCase();

        if (this.fileExtensions.length > 0 && !this.fileExtensions.includes(fileExtension))
            return await next();

        const filePath = path.join(this.publicFolder, safeUrl);
        if (!File.exists(filePath))
            return await next();

        const info = await stat(filePath);
        const mimeType = "image/png"; //MimeTypes.get(path.extname(filePath).slice(1).toLowerCase()) || "application/octet-stream";
        httpContext.response
            .setHeader("Content-Type", mimeType)
            .setHeader("Content-Length", info.size)
            .stream(createReadStream(filePath));

        return;
    }
}
