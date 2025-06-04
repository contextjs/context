/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { HttpContext } from "@contextjs/webserver";
import { IActionResult } from "../interfaces/i-action-result.js";

export function Content(content: string, contentType = "text/plain; charset=utf-8", statusCode = 200, statusMessage = "OK"): IActionResult {
    return new ContentResult(content, contentType, statusCode, statusMessage);
}

class ContentResult implements IActionResult {
    constructor(
        private readonly content: string,
        private readonly contentType: string,
        private readonly statusCode: number,
        private readonly statusMessage: string) { }

    public async executeAsync(httpContext: HttpContext): Promise<void> {
        await httpContext.response
            .setStatus(this.statusCode, this.statusMessage)
            .setHeader("Content-Type", this.contentType)
            .sendAsync(this.content);
    }
}