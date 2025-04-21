/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { IMiddleware } from "../interfaces/i-middleware.js";
import { WebServer } from "../webserver.js";
import { SSLCertificate } from "./ssl-certificate.js";

export class WebServerOptions {
    public webServer!: WebServer;
    public http: { enabled: boolean; port?: number; timeout?: number };
    public https: { enabled: boolean; port?: number; certificate?: SSLCertificate; timeout?: number };

    constructor() {
        this.http = { enabled: true, port: 5000, timeout: 120_000 }; // 2 min
        this.https = { enabled: false, timeout: 120_000 };
    }

    public useMiddleware(middleware: IMiddleware): WebServerOptions {
        this.webServer.useMiddleware(middleware);
        return this;
    }
}