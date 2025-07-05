/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import "@contextjs/webserver";
import "@contextjs/webserver-middleware-controllers";

import { WebServerOptions } from "@contextjs/webserver";
import { MVCMiddleware } from "../mvc.middleware.js";

declare module "@contextjs/webserver" {
    export interface WebServerOptions {
        useMvc(): WebServerOptions;
    }
}

WebServerOptions.prototype.useMvc = function (): WebServerOptions {
    if (!this.webServer.application.webServer.hasMiddleware("ControllersMiddleware"))
        this.useControllers();

    this.useMiddleware(new MVCMiddleware(this.webServer));

    return this;
};