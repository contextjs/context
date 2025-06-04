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

export function Json(value: any): IActionResult {
    return new JsonResult(value);
}

class JsonResult implements IActionResult {
    public constructor(private readonly value: any) { }

    public async executeAsync(httpContext: HttpContext): Promise<void> {
        if (ObjectExtensions.isNullOrUndefined(this.value))
            return await NoContent().executeAsync(httpContext);

        await httpContext.response
            .setStatus(200, "OK")
            .setHeader("Content-Type", "application/json")
            .sendAsync(JSON.stringify(this.value));
    }
}