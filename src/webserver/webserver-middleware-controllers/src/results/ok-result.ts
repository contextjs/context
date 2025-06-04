/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ObjectExtensions } from "@contextjs/system";
import { HttpContext } from "@contextjs/webserver";
import { IActionResult } from "../interfaces/i-action-result.js";
import { NoContent } from "./no-content-result.js";

export function OK(value?: string): IActionResult {
    return new OkResult(value);
}

class OkResult implements IActionResult {
    constructor(private readonly value?: string) { }

    public async executeAsync(httpContext: HttpContext): Promise<void> {
        if (ObjectExtensions.isNullOrUndefined(this.value))
            return await NoContent().executeAsync(httpContext);

        await httpContext.response
            .setStatus(200, "OK")
            .setHeader("Content-Type", "text/plain")
            .sendAsync(this.value);
    }
}