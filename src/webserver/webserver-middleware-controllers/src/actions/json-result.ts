import { ObjectExtensions } from "@contextjs/system";
import { HttpContext } from "@contextjs/webserver";
import { IActionResult } from "../interfaces/i-action-result.js";
import { NoContent } from "./no-content-result.js";

export function Json(value: any): IActionResult {
    return new JsonResult(value);
}

class JsonResult implements IActionResult {
    public constructor(private readonly value: any) { }

    public async executeAsync(httpContext: HttpContext): Promise<any> {
        if (ObjectExtensions.isNullOrUndefined(this.value))
            return NoContent().executeAsync(httpContext);

        httpContext.response.setStatus(200, "OK");
        httpContext.response.setHeader("Content-Type", "application/json");
        httpContext.response.sendAsync(JSON.stringify(this.value));

        return Promise.resolve(httpContext.response);
    }
}