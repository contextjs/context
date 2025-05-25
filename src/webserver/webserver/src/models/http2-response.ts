/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { OutgoingHttpHeaders, ServerHttp2Stream } from "node:http2";
import { ResponseSentException } from "../exceptions/response-sent.exception.js";
import { HeaderCollection } from "./header.collection.js";

/**
 * Adapter to allow using the same Response API over an HTTP/2 stream.
 */
export class Http2Response {
    private http2Stream!: ServerHttp2Stream;
    private responseSent = false;

    private static readonly FORBIDDEN_HEADERS = new Set([
        "connection",
        "keep-alive",
        "proxy-connection",
        "transfer-encoding",
        "upgrade",
    ]);

    public statusCode: number = 200;
    public statusMessage: string = "OK";
    public headers: HeaderCollection = new HeaderCollection();

    public initialize(stream: ServerHttp2Stream): this {
        this.http2Stream = stream;
        this.reset();

        return this;
    }

    public reset(): this {
        this.responseSent = false;
        this.setStatus(200, "OK");
        this.headers.clear();

        return this;
    }

    public setHeader(name: string, value: string | number | string[]): this {
        if (this.responseSent)
            throw new ResponseSentException();

        let headerValue: string;
        if (typeof value === "number")
            headerValue = value.toString();
        else if (Array.isArray(value))
            headerValue = value.join(", ");
        else
            headerValue = value;

        this.headers.set(name, headerValue);

        return this;
    }

    public setStatus(code: number, message: string): this {
        if (this.responseSent)
            throw new ResponseSentException();

        this.statusCode = code;
        this.statusMessage = message;

        return this;
    }

    public setConnectionClose(close: boolean): this {
        return this;
    }

    public send(body: Buffer | string): void {
        if (this.responseSent)
            throw new ResponseSentException();

        this.responseSent = true;

        const payload = typeof body === "string"
            ? Buffer.from(body)
            : body;

        const outHeaders: OutgoingHttpHeaders = { ":status": this.statusCode };
        for (const [key, value] of this.headers.entries())
            if (!Http2Response.FORBIDDEN_HEADERS.has(key.toLowerCase()))
                outHeaders[key] = value;

        this.http2Stream.respond(outHeaders);
        this.http2Stream.end(payload);
    }

    public stream(stream: NodeJS.ReadableStream): void {
        if (this.responseSent)
            throw new ResponseSentException();

        this.responseSent = true;

        const outHeaders: OutgoingHttpHeaders = { ":status": this.statusCode };
        for (const [key, value] of this.headers.entries())
            if (!Http2Response.FORBIDDEN_HEADERS.has(key.toLowerCase()))
                outHeaders[key] = value;

        this.http2Stream.respond(outHeaders);

        stream.once("error", err => { this.http2Stream.destroy(err); });
        stream.pipe(this.http2Stream);
    }

    public end(): void {
        if (this.responseSent)
            throw new ResponseSentException();

        const outHeaders: OutgoingHttpHeaders = { ":status": this.statusCode };
        for (const [key, value] of this.headers.entries())
            if (!Http2Response.FORBIDDEN_HEADERS.has(key.toLowerCase()))
                outHeaders[key] = value;

        this.http2Stream.respond(outHeaders);
        this.http2Stream.end();

        this.responseSent = true;
    }
}
