/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { File, Path } from "@contextjs/io";
import { StringExtensions } from "@contextjs/system";
import { HttpContext, IMiddleware, MimeTypes } from "@contextjs/webserver";
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
        if (StringExtensions.isNullOrWhitespace(requestUrl)) {
            httpContext.response.setStatus(500, "Server Error");
            await httpContext.response.sendAsync("Server Error: Invalid request URL.");
            return;
        }

        const safeUrl = Path.normalize(requestUrl);
        const fileExtension = File.getExtension(safeUrl);

        if (!fileExtension || (this.fileExtensions.length > 0 && !this.fileExtensions.includes(fileExtension)))
            return await next();

        const filePath = path.join(this.publicFolder, safeUrl);
        if (!File.exists(filePath))
            return await next();

        const info = await stat(filePath);
        const mimeType = MimeTypes.get(fileExtension) ?? "text/plain";
        await httpContext.response
            .setHeader("Content-Type", mimeType)
            .setHeader("Content-Length", info.size)
            .streamAsync(createReadStream(filePath));
    }
}
