/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Application, Throw } from "@contextjs/system";
import { WebServerOptions } from "../options/webserver-options.js";
import { WebServer } from "../webserver.js";

declare module "@contextjs/system" {
    export interface Application {
        useWebServer(options: (webserverOptions: WebServerOptions) => void): Application;
        webServer: WebServer;
    }
}

Application.prototype.useWebServer = function (options: (webserverOptions: WebServerOptions) => void): Application {
    Throw.ifNullOrUndefined(options);

    let webServerOptions = new WebServerOptions();
    const webServer = new WebServer(webServerOptions);
    this.webServer = webServerOptions.webServer = webServer;
    options(webServerOptions);

    this.onRun(async () => await this.webServer.startAsync());

    return this;
}