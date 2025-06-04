import { HttpContext } from "@contextjs/webserver";

export interface IActionResult {
    executeAsync(httpContext: HttpContext): Promise<any>;
}