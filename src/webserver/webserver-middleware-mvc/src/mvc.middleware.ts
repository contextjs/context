/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { HttpContext, IMiddleware, WebServer } from "@contextjs/webserver";

export class MVCMiddleware implements IMiddleware {
    public name: string = "MvcMiddleware";
    public version: string = "1.0.0";

    private readonly webServer: WebServer;

    public constructor(webServer: WebServer) {
        this.webServer = webServer;
    }

    public async onRequest(httpContext: HttpContext): Promise<void> {
        // Implement view rendering logic here (from compilations, cache, direct rendering or other sources)
        return;
    }
}