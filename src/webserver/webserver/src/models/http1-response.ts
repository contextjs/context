import { Socket } from "node:net";
import { ResponseSentException } from "../exceptions/response-sent.exception.js";
import { BufferExtensions } from "../extensions/buffer.extensions.js";
import { HeaderCollection } from "./header.collection.js";
import { StreamChunker } from "./stream-chunker.js";

export class Http1Response {
    private socket!: Socket;
    private responseSent = false;
    private shouldClose = false;

    private readonly CRLF = BufferExtensions.create("\r\n");
    private readonly KEEP_ALIVE = BufferExtensions.create("Connection: keep-alive\r\n");
    private readonly CONNECTION_CLOSE = BufferExtensions.create("Connection: close\r\n");
    private readonly STATUS_200_OK = BufferExtensions.create("HTTP/1.1 200 OK\r\n");
    private readonly TRANSFER_ENCODING_CHUNKED = BufferExtensions.create("Transfer-Encoding: chunked\r\n");

    private statusBuffers = new Map<string, Buffer>();
    private lengthBuffers = new Map<number, Buffer>();

    public headers: HeaderCollection = new HeaderCollection();
    public statusCode: number = 200;
    public statusMessage: string = "OK";

    public initialize(socket: Socket): this {
        this.socket = socket;
        this.responseSent = false;
        this.shouldClose = false;
        this.setStatus(200, "OK");
        this.headers.clear();
        this.statusBuffers.clear();
        this.lengthBuffers.clear();

        return this;
    }

    public reset(): void {
        this.responseSent = false;
        this.shouldClose = false;
        this.setStatus(200, "OK");
        this.headers.clear();
        this.statusBuffers.clear();
        this.lengthBuffers.clear();
    }

    public setConnectionClose(close: boolean): this {
        this.shouldClose = close;

        return this;
    }

    public setStatus(code: number, message: string): this {
        if (this.responseSent)
            throw new ResponseSentException();
        
        this.statusCode = code;
        this.statusMessage = message;

        return this;
    }

    public setHeader(name: string, value: string | number | string[]): this {
        const headerValue = typeof value === "number"
            ? String(value)
            : Array.isArray(value)
                ? value.join(", ")
                : value;
        this.headers.set(name, headerValue);

        return this;
    }

    public send(body: Buffer | string): void {
        if (this.responseSent)
            throw new ResponseSentException();

        const bodyBuffer = typeof body === "string"
            ? Buffer.from(body)
            : body;

        const headerBuffer = this.createHeaderBuffer(false, bodyBuffer.length);
        this.socket.cork();
        this.socket.write(headerBuffer);
        this.socket.write(bodyBuffer);
        this.socket.uncork();

        this.responseSent = true;
    }

    public end(): void {
        if (this.responseSent)
            throw new ResponseSentException();

        const headerBuffer = this.createHeaderBuffer(false);
        this.socket.cork();
        this.socket.write(headerBuffer);
        this.socket.uncork();
        this.socket.end();
        
        this.responseSent = true;
    }

    public stream(stream: NodeJS.ReadableStream): void {
        if (this.responseSent)
            throw new ResponseSentException();

        const headerBuffer = this.createHeaderBuffer(true);
        this.socket.cork();
        this.socket.write(headerBuffer);
        this.socket.uncork();

        stream
            .pipe(new StreamChunker())
            .pipe(this.socket, { end: this.shouldClose });

        this.responseSent = true;
    }

    private createHeaderBuffer(chunked: boolean, length?: number): Buffer {
        const parts: Buffer[] = [];

        parts.push(this.createStatusBuffer(this.statusCode, this.statusMessage));

        if (!this.headers.has("date"))
            parts.push(BufferExtensions.create(`Date: ${new Date().toUTCString()}\r\n`));

        for (const [headerName, headerValue] of this.headers.entries())
            parts.push(BufferExtensions.create(`${headerName}: ${headerValue}\r\n`));

        parts.push(chunked ? this.TRANSFER_ENCODING_CHUNKED : this.getBufferLength(length!));
        parts.push(this.shouldClose ? this.CONNECTION_CLOSE : this.KEEP_ALIVE);
        parts.push(this.CRLF);

        return Buffer.concat(parts);
    }

    private createStatusBuffer(code: number, message: string): Buffer {
        if (code === 200 && message === "OK")
            return this.STATUS_200_OK;

        const key = `${code} ${message}`;
        let statusBuffer = this.statusBuffers.get(key);

        if (statusBuffer !== undefined)
            return statusBuffer;

        statusBuffer = BufferExtensions.create(`HTTP/1.1 ${key}\r\n`);
        this.statusBuffers.set(key, statusBuffer);

        return statusBuffer;
    }

    private getBufferLength(length: number = 0): Buffer {
        let lengthBuffer = this.lengthBuffers.get(length);
        if (lengthBuffer !== undefined)
            return lengthBuffer;

        lengthBuffer = BufferExtensions.create(`Content-Length: ${length}\r\n`);
        this.lengthBuffers.set(length, lengthBuffer);

        return lengthBuffer;
    }
}