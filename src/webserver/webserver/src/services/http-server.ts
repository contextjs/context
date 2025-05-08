/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { once } from "node:events";
import { createServer, Server, Socket } from "node:net";
import type { WebServerOptions } from "../options/webserver-options.js";
import { ServerBase } from "./server-base.js";

export class HttpServer extends ServerBase {
    private readonly server: Server = createServer();
    private readonly label = "ContextJS Web Server [http]";

    public constructor(options: WebServerOptions) {
        super(options);
        this.configure();
    }

    public async restartAsync(): Promise<void> {
        this.options.onEvent({ type: "info", detail: `Restarting ${this.label}` });
        await this.stopAsync();
        await this.startAsync();
    }

    public async startAsync(): Promise<void> {
        this.server.listen(this.options.http.port, this.options.http.host);
        this.setIdleSocketsInterval();
        this.options.onEvent({ type: "info", detail: `Starting ${this.label} on ${this.options.http.host ?? "localhost"}:${this.options.http.port}` });

        const [event, payload] = await Promise.race([
            once(this.server, "listening").then(() => ["listening", undefined] as const),
            once(this.server, "error").then(([error]) => ["error", error] as const),
        ]);

        if (event === "error") {
            this.options.onEvent({ type: "error", detail: payload });
            throw payload;
        }
    }

    public async stopAsync(): Promise<void> {
        if (this.idleTimer)
            clearInterval(this.idleTimer);
        this.isShuttingDown = true;
        this.server.close();
        this.options.onEvent({ type: "info", detail: `Stopping ${this.label}` });

        const serverClose = once(this.server, "close").then(() => { });

        const connectedSockets = Array.from(this.sockets.keys());
        if (connectedSockets.length === 0) {
            this.options.onEvent({ type: "info", detail: `No active connections. ${this.label} shutdown complete.` });
            await serverClose;
            return;
        }

        this.options.onEvent({ type: "info", detail: `Waiting for ${connectedSockets.length} active connection(s) to close...` });

        const socketCloses = connectedSockets.map(socket => once(socket, "close").then(() => { }));

        const timeout = new Promise<void>(resolve => {
            setTimeout(() => {
                this.options.onEvent({ type: "warning", detail: `Timeout reached (${this.options.general.idleSocketsTimeout}ms). Destroying remaining sockets...` });
                for (const socket of connectedSockets)
                    socket.destroy();
                resolve();
            }, this.options.general.idleSocketsTimeout);
        });

        await Promise.race([Promise.all(socketCloses), timeout]);
        await serverClose;
        this.options.onEvent({ type: "info", detail: `${this.label} shutdown complete.` });
    }

    private configure(): void {
        this.server.removeAllListeners("connection");
        this.server.on("connection", (socket: Socket) => {
            this.sockets.set(socket, { lastActive: Date.now() });
            socket.once("close", () => this.sockets.delete(socket));
            this.handleSocket(socket);
        });
    }
}