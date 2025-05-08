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

    let webserverOptions = new WebServerOptions();
    options(webserverOptions);
    const webServer = new WebServer(webserverOptions);
    this.webServer = webServer;
    webserverOptions.webServer = webServer;

    this.onRun(async () => await this.webServer.startAsync());

    return this;
}