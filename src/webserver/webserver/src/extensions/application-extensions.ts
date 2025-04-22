/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Application, Throw } from "@contextjs/system";
import { WebServerOptions } from "./webserver-options.js";
import { WebServer } from "../webserver.js";

declare module "@contextjs/system" {
    export interface Application {
        useWebServer(options: (webserverOptions: WebServerOptions) => void): Application;
        webserver: WebServer | null;
    }
}

Application.prototype.useWebServer = function (options: (webserverOptions: WebServerOptions) => void): Application {

    Throw.ifNullOrUndefined(options);

    const webserverOptions = new WebServerOptions();
    const webServer = new WebServer(webserverOptions);
    webserverOptions.webServer = webServer;

    options(webserverOptions);
    this.onRun(async () => await webServer.startAsync());
    this.webserver = webServer;

    return this;
}