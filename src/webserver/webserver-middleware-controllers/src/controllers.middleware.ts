/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { HttpContext, IMiddleware, WebServer } from "@contextjs/webserver";
import { ActionExecutorService } from "./services/action-executor.service.js";

export class ControllersMiddleware implements IMiddleware {
    public name: string = "ControllersMiddleware";
    public version: string = "1.0.0";
    public defaultController: string = "home";
    public defaultAction: string = "index";

    private readonly webServer: WebServer;

    public constructor(webServer: WebServer) {
        this.webServer = webServer;
    }

    public async onRequest(httpContext: HttpContext): Promise<void> {
        return await ActionExecutorService.executeAsync(this.webServer, httpContext, this.defaultController, this.defaultAction);
    }
}