import { HttpContext } from "@contextjs/webserver";
import { IActionResult } from "../interfaces/i-action-result.js";

export function NoContent(): IActionResult {
    return new NoContentResult();
}

class NoContentResult implements IActionResult {
    public async executeAsync(httpContext: HttpContext): Promise<any> {
        httpContext.response.setStatus(204, "No Content");
        httpContext.response.endAsync();

        return Promise.resolve(httpContext.response);
    }
}