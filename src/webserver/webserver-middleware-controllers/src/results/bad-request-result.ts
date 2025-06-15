/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { StringExtensions } from "@contextjs/system";
import { HttpContext } from "@contextjs/webserver";
import { IActionResult } from "../interfaces/i-action-result.js";

export function BadRequest(message?: string): IActionResult {
    return new BadRequestResult(message);
}

class BadRequestResult implements IActionResult {
    public constructor(private readonly message?: string) { }

    public async executeAsync(httpContext: HttpContext): Promise<void> {
        if (StringExtensions.isNullOrWhitespace(this.message))
            await httpContext.response
                .setStatus(400, "Bad Request")
                .endAsync();
        else
            await httpContext.response
                .setStatus(400, "Bad Request")
                .setHeader("Content-Type", "text/plain; charset=utf-8")
                .sendAsync(this.message);
    }
}