/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { IMiddleware } from "../interfaces/i-middleware.js";
import { WebServer } from "../webserver.js";

export class WebServerOptions {
    public webServer!: WebServer;
    public http: { enabled: boolean; port?: number; };
    public https: { enabled: boolean; port?: number; certificate?: SSLCertificate; };

    constructor() {
        this.http = { enabled: true, port: 5000 };
        this.https = { enabled: false };
    }

    public useMiddleware(middleware: IMiddleware): WebServerOptions {
        this.webServer.useMiddleware(middleware);
        return this;
    }
}

export type SSLCertificate = {
    key: string;
    certificate: string;
}