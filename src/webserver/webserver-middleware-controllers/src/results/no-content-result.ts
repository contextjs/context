/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { HttpContext } from "@contextjs/webserver";
import { IActionResult } from "../interfaces/i-action-result.js";

export function NoContent(): IActionResult {
    return new NoContentResult();
}

class NoContentResult implements IActionResult {
    public async executeAsync(httpContext: HttpContext): Promise<void> {
        await httpContext.response
            .setStatus(204, "No Content")
            .endAsync();
    }
}