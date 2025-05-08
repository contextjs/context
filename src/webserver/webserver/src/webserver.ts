/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { WebServerOptions } from "./options/webserver-options.js";
import { IMiddleware } from "./interfaces/i-middleware.js";
import { HttpServer } from "./services/http-server.js";
import { HttpsServer } from "./services/https-server.js";

export class WebServer {
    private httpServer?: HttpServer;
    private httpsServer?: HttpsServer;
    private readonly sigHandler: () => Promise<void[]>;

    public constructor(options: WebServerOptions) {
        if (!options.http.enabled && !options.https.enabled)
            options.onEvent({ type: "error", detail: "At least one of HTTP or HTTPS must be enabled." });

        if (options.http.enabled)
            this.httpServer = new HttpServer(options);
        if (options.https.enabled)
            this.httpsServer = new HttpsServer(options);

        this.sigHandler = this.stopAsync.bind(this);
        process.on("SIGINT", this.sigHandler);
        process.on("SIGTERM", this.sigHandler);
    }

    public useMiddleware(middleware: IMiddleware): this {
        if (this.httpServer)
            this.httpServer.useMiddleware(middleware);
        if (this.httpsServer)
            this.httpsServer.useMiddleware(middleware);

        return this;
    }

    public startAsync(): Promise<void[]> {
        const tasks: Promise<void>[] = [];
        if (this.httpServer)
            tasks.push(this.httpServer.startAsync());
        if (this.httpsServer)
            tasks.push(this.httpsServer.startAsync());

        return Promise.all(tasks);
    }

    public stopAsync(): Promise<void[]> {
        const tasks: Promise<void>[] = [];
        if (this.httpServer)
            tasks.push(this.httpServer.stopAsync());
        if (this.httpsServer)
            tasks.push(this.httpsServer.stopAsync());

        return Promise.all(tasks);
    }

    public restartAsync(): Promise<void[]> {
        const tasks: Promise<void>[] = [];
        if (this.httpServer)
            tasks.push(this.httpServer.restartAsync());
        if (this.httpsServer)
            tasks.push(this.httpsServer.restartAsync());

        return Promise.all(tasks);
    }

    public dispose(): void {
        process.off("SIGINT", this.sigHandler);
        process.off("SIGTERM", this.sigHandler);
    }
}