/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { HttpContext } from "@contextjs/webserver";
import { IActionResult } from "../interfaces/i-action-result.js";

export function NotFound(): IActionResult {
    return new NotFoundResult();
}

class NotFoundResult implements IActionResult {
    public async executeAsync(httpContext: HttpContext): Promise<void> {
        await httpContext.response
            .setStatus(404, "Not Found")
            .endAsync();
    }
}