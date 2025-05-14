/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Dictionary } from "@contextjs/collections";
import { Socket } from "node:net";
import { PassThrough } from "node:stream";
import { MiddlewareExistsException } from "../exceptions/middleware-exists.exception.js";
import { BufferExtensions } from "../extensions/buffer.extensions.js";
import { WebServerOptions } from "../options/webserver-options.js";
import { IMiddleware } from "../interfaces/i-middleware.js";
import { HeaderCollection } from "../models/header.collection.js";
import { HttpContextPool } from "../models/http-context-pool.js";
import { HttpContext } from "../models/http-context.js";
import { HeaderParser } from "./header-parser.js";

enum ParseState {
    HEADER,
    BODY
}

export abstract class ServerBase {
    protected sockets = new Map<Socket, { lastActive: number }>();
    private middleware = new Dictionary<string, IMiddleware>();
    protected idleTimer!: NodeJS.Timeout;
    protected isShuttingDown = false;
    protected middlewareExecutor: (ctx: HttpContext) => Promise<void> = async () => { };
    protected httpContextPool!: HttpContextPool;
    protected options: WebServerOptions;

    private headerTooLargeResponse = BufferExtensions.create(
        "HTTP/1.1 431 Request Header Fields Too Large\r\nConnection: close\r\n\r\n"
    );

    public constructor(options: WebServerOptions) {
        this.options = options;
        this.httpContextPool = new HttpContextPool(this.options.general.httpContextPoolSize);
    }

    public useMiddleware(middleware: IMiddleware): this {
        if (this.middleware.has(middleware.name))
            throw new MiddlewareExistsException(middleware.name);

        this.middleware.set(middleware.name, middleware);
        this.middlewareExecutor = this.compileMiddleware();

        return this;
    }

    public async dispatchRequestAsync(httpContext: HttpContext): Promise<void> {
        try {
            await this.middlewareExecutor(httpContext);
        }
        catch {
            httpContext.response
                .setStatus(500, "Internal Server Error")
                .setHeader("Content-Type", "text/plain")
                .sendAsync("Internal Server Error");
        }
    }

    protected handleSocket(socket: Socket): void {
        const parser = new HeaderParser(this.options.general.maximumHeaderSize);
        let state = ParseState.HEADER;
        let remainingBodyBytes = 0;
        let activeRequests = 0;
        let connectionClosed = false;
        let bodyStream: PassThrough | null = null;

        socket.on("data", async (data: Buffer) => {
            if (connectionClosed) return;
            this.updateSocketLastActive(socket);

            let buffer = data;
            while (buffer.length > 0) {
                if (state === ParseState.HEADER) {
                    const result = parser.append(buffer);
                    if (result.overflow) {
                        socket.write(this.headerTooLargeResponse);
                        this.options.onEvent({ type: "error", detail: "HTTP/1.1 431 Request Header Fields Too Large", });
                        socket.end();
                        connectionClosed = true;
                        return;
                    }

                    if (!result.header)
                        break;

                    const raw = result.header;
                    buffer = result.remaining ?? Buffer.alloc(0);

                    const context = this.httpContextPool.acquire();
                    const { method, path, headers } = this.parseRequestHeaders(raw, context.request.headers);
                    if (!method || !path) {
                        socket.end();
                        connectionClosed = true;
                        return;
                    }

                    const contentLength = headers.get("content-length");
                    remainingBodyBytes = contentLength
                        ? parseInt(Array.isArray(contentLength) ? contentLength[0] : contentLength, 10) || 0
                        : 0;

                    bodyStream = new PassThrough();
                    activeRequests++;

                    const shouldClose = this.shouldCloseConnection(headers);
                    context.initialize(method, path, headers, socket, bodyStream!);
                    context.response.setConnectionClose(shouldClose);

                    try {
                        await this.dispatchRequestAsync(context);
                    }
                    finally {
                        activeRequests--;
                        this.httpContextPool.release(context);
                        if (shouldClose && activeRequests === 0)
                            socket.end();
                    }

                    state = ParseState.BODY;
                    continue;
                }

                const take = Math.min(remainingBodyBytes, buffer.length);
                bodyStream!.write(buffer.subarray(0, take));
                buffer = buffer.subarray(take);
                remainingBodyBytes -= take;

                if (remainingBodyBytes === 0) {
                    bodyStream!.end();
                    bodyStream = null;
                    state = ParseState.HEADER;
                }
            }
        });

        socket.on("error", error => this.onSocketError(error));
    }

    protected setIdleSocketsInterval(): void {
        this.idleTimer = setInterval(() => {
            const now = Date.now();
            for (const [socket, info] of this.sockets.entries()) {
                const idle = now - info.lastActive;
                if (idle > this.options.http.keepAliveTimeout) {
                    socket.destroy();
                    this.sockets.delete(socket);
                    this.options.onEvent({ type: "info", detail: `Closing idle socket (${idle}ms)`, });
                }
            }
        }, this.options.general.idleSocketsTimeout);
    }

    private parseRequestHeaders(headerBuffer: Buffer, headers: HeaderCollection): { method: string; path: string; headers: HeaderCollection } {
        const text = headerBuffer.toString("ascii");
        const [requestLine, ...lines] = text.split("\r\n");
        const [method, path] = requestLine.split(" ");
        for (const line of lines) {
            const lineIndex = line.indexOf(":");
            if (lineIndex > -1)
                headers.set(line.slice(0, lineIndex).trim(), line.slice(lineIndex + 1).trim());
        }

        return { method, path, headers };
    }

    private shouldCloseConnection(headers: HeaderCollection): boolean {
        return (this.isShuttingDown || headers.get("connection")?.toLowerCase() === "close");
    }

    private onSocketError(error: NodeJS.ErrnoException): void {
        const code = error.code ?? "";
        if (!["ECONNRESET", "EPIPE", "ECONNABORTED"].includes(code))
            this.options.onEvent({ type: "error", detail: error });
    }

    protected updateSocketLastActive(socket: Socket): void {
        const record = this.sockets.get(socket);
        if (record)
            record.lastActive = Date.now();
    }

    private compileMiddleware(): (httpContext: HttpContext) => Promise<void> {
        const middlewareList = this.middleware.values();
        let executor: (httpContext: HttpContext) => Promise<void> = async () => { };

        for (let i = middlewareList.length - 1; i >= 0; i--) {
            const middleware = middlewareList[i];
            const next = executor;
            if (middleware.onRequest.length < 2) {
                executor = async httpContext => {
                    const result = middleware.onRequest(httpContext);
                    if (result instanceof Promise)
                        await result;
                    await next(httpContext);
                };
            }
            else
                executor = async (httpContext: HttpContext) => middleware.onRequest(httpContext, () => next(httpContext));
        }

        return executor;
    }
}