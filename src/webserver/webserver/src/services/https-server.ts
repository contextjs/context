/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { File } from "@contextjs/io";
import { once } from "node:events";
import { Http2SecureServer, IncomingHttpHeaders, SecureServerOptions, ServerHttp2Session, createSecureServer as createHttp2Server } from "node:http2";
import { ListenOptions } from "node:net";
import tls, { TLSSocket, TlsOptions } from "node:tls";
import { InvalidCertificateKeyException } from "../exceptions/invalid-certificate-key.exception.js";
import { InvalidCertificateException } from "../exceptions/invalid-certificate.exception.js";
import type { WebServerOptions } from "../options/webserver-options.js";
import { ServerBase } from "./server-base.js";
import { HttpVerb } from "../models/http-verb.js";

export class HttpsServer extends ServerBase {
    private readonly label = "ContextJS Web Server [https]";
    private tlsServer: tls.Server;
    private httpsServer: Http2SecureServer;
    private sessions = new Set<ServerHttp2Session>();

    constructor(options: WebServerOptions) {
        super(options);

        const key = File.read(this.options.https.certificate.key);
        if (!key)
            throw new InvalidCertificateKeyException(this.options.https.certificate.key);

        const cert = File.read(this.options.https.certificate.cert);
        if (!cert)
            throw new InvalidCertificateException(this.options.https.certificate.cert);

        this.httpsServer = createHttp2Server({ key, cert, allowHTTP1: false } as SecureServerOptions);

        this.httpsServer.on("session", (session) => {
            session.settings({
                maxConcurrentStreams: 1_000,
                headerTableSize: 32_768,
                maxHeaderListSize: this.options.general.maximumHeaderSize,
                initialWindowSize: 1 << 20
            });
            this.sessions.add(session);
            session.once("close", () => this.sessions.delete(session));
        });

        this.httpsServer.on("stream", (stream, headers: IncomingHttpHeaders) => {
            const method = (headers[":method"] as HttpVerb) || "GET";
            const path = (headers[":path"] as string) || "/";

            const context = this.httpContextPool.acquire();
            for (const [name, value] of Object.entries(headers)) {
                if (name.startsWith(":") || value == null)
                    continue;

                context.request.headers.set(name, Array.isArray(value) ? value.join(", ") : (value as string));
            }

            const hasBody = !!headers["content-length"] || ["POST", "PUT", "PATCH"].includes(method);
            context.initialize(method, path, context.request.headers, stream, hasBody ? stream : null!);
            context.response.setConnectionClose(false);

            Promise.resolve(this.dispatchRequestAsync(context))
                .catch((error) => this.options.onEvent({ type: "error", detail: error }))
                .finally(() => this.httpContextPool.release(context));

            stream.on("error", (error) => {
                this.options.onEvent({ type: "error", detail: error });
                stream.destroy(error);
            });

            stream.once("aborted", () => {
                this.options.onEvent({ type: "warning", detail: "Client aborted the request" });
                stream.destroy();
            });
        });

        this.httpsServer.on("error", (error) => this.options.onEvent({ type: "error", detail: error }));

        const tlsOpts: TlsOptions = { key, cert, ALPNProtocols: ["h2", "http/1.1"] } as TlsOptions;
        this.tlsServer = tls.createServer(tlsOpts, (socket: TLSSocket) => {
            socket.setNoDelay(true);
            this.sockets.set(socket, { lastActive: Date.now() });
            socket.once("close", () => this.sockets.delete(socket));

            if (socket.alpnProtocol === "h2")
                this.httpsServer.emit("secureConnection", socket);
            else
                this.handleSocket(socket);
        });

        this.tlsServer.on("error", (error) => this.options.onEvent({ type: "error", detail: error }));
    }

    public async startAsync(): Promise<void> {
        const listenOptions: ListenOptions = {
            port: this.options.https.port,
            host: this.options.https.host,
            backlog: 1024,
            ...(process.platform === "linux"
                ? { reusePort: true }
                : {})
        };

        this.options.onEvent({ type: "info", detail: `${this.label} is starting...` });

        this.tlsServer.listen(listenOptions);

        const [event, payload] = await Promise.race([
            once(this.tlsServer, "listening").then(() => ["listening", undefined] as const),
            once(this.tlsServer, "error").then(([err]) => ["error", err] as const)
        ]);

        if (event === "error") {
            this.options.onEvent({ type: "error", detail: payload });
            throw payload;
        }

        this.setIdleSocketsInterval();
        this.options.onEvent({ type: "info", detail: `${this.label} listening on https://${listenOptions.host}:${listenOptions.port}` });
    }

    public async stopAsync(): Promise<void> {
        if (this.idleTimer)
            clearInterval(this.idleTimer);
        this.isShuttingDown = true;
        this.options.onEvent({ type: "info", detail: `Stopping ${this.label}` });

        this.tlsServer.close();

        this.httpsServer.close();
        this.options.onEvent({ type: "info", detail: "HTTP/2 server closed" });

        this.options.onEvent({ type: "info", detail: "Destroying all sockets" });
        for (const socket of this.sockets.keys()) {
            socket.destroy();
            this.sockets.delete(socket);
        }

        this.options.onEvent({ type: "info", detail: `Destroying all sessions` });
        for (const session of this.sessions) {
            session.destroy();
            this.sessions.delete(session);
        }

        await once(this.tlsServer, "close");

        this.options.onEvent({ type: "info", detail: `${this.label} fully stopped` });
    }
}