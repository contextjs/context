/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Application, Throw } from "@contextjs/system";
import { IMiddleware } from "./interfaces/i-middleware.js";
import { WebServerOptions } from "./options/webserver-options.js";
import { HttpServer } from "./services/http-server.js";
import { HttpsServer } from "./services/https-server.js";

export class WebServer {
    private httpServer?: HttpServer;
    private httpsServer?: HttpsServer;
    private options: WebServerOptions;
    private middleware: IMiddleware[] = [];
    private readonly sigHandler: () => Promise<void[]>;

    public application!: Application;

    public constructor(options: WebServerOptions) {
        if (!options.http.enabled && !options.https.enabled)
            options.onEvent({ type: "error", detail: "At least one of HTTP or HTTPS must be enabled." });

        this.options = options;
        this.sigHandler = this.stopAsync.bind(this);
        process.on("SIGINT", this.sigHandler);
        process.on("SIGTERM", this.sigHandler);
    }

    public useMiddleware(middleware: IMiddleware): this {
        Throw.ifNullOrUndefined(middleware);

        this.middleware.push(middleware);
        return this;
    }

    public setOptions(options: WebServerOptions): this {
        if (!options.http.enabled && !options.https.enabled)
            options.onEvent({ type: "error", detail: "At least one of HTTP or HTTPS must be enabled." });

        this.options = options;

        return this;
    }

    public async startAsync(): Promise<void[]> {
        if (this.httpServer || this.httpsServer)
            throw new Error("WebServer already started");

        const tasks: Promise<void>[] = [];

        if (this.options.http.enabled) {
            this.httpServer = new HttpServer(this.options);
            this.middleware.forEach(middleware => this.httpServer!.useMiddleware(middleware));
            tasks.push(this.httpServer.startAsync());
        }
        if (this.options.https.enabled) {
            this.httpsServer = new HttpsServer(this.options);
            this.middleware.forEach(middleware => this.httpsServer!.useMiddleware(middleware));
            tasks.push(this.httpsServer.startAsync());
        }

        return Promise.all(tasks).catch(async error => { await this.stopAsync(); throw error; });
    }

    public async stopAsync(): Promise<void[]> {
        const tasks: Promise<void>[] = [];
        if (this.httpServer)
            tasks.push(this.httpServer.stopAsync());
        if (this.httpsServer)
            tasks.push(this.httpsServer.stopAsync());

        const result = Promise.all(tasks)
        if (this.httpServer)
            this.httpServer = undefined;
        if (this.httpsServer)
            this.httpsServer = undefined;

        return result;
    }

    public async restartAsync(): Promise<void[]> {
        await this.stopAsync();
        return this.startAsync();
    }

    public dispose(): void {
        process.off("SIGINT", this.sigHandler);
        process.off("SIGTERM", this.sigHandler);
    }
}