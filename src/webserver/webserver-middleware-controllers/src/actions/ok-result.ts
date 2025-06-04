import { ObjectExtensions } from "@contextjs/system";
import { HttpContext } from "@contextjs/webserver";
import { IActionResult } from "../interfaces/i-action-result.js";
import { NoContent } from "./no-content-result.js";

export function OK(value?: string): IActionResult {
    return new OkResult(value);
}

class OkResult implements IActionResult {
    constructor(private readonly value?: string) { }

    public async executeAsync(httpContext: HttpContext): Promise<any> {
        if (ObjectExtensions.isNullOrUndefined(this.value))
            return NoContent().executeAsync(httpContext);

        httpContext.response.setStatus(200, "OK");
        httpContext.response.setHeader("Content-Type", "text/plain");
        httpContext.response.sendAsync(this.value);

        return Promise.resolve(httpContext.response);
    }
}