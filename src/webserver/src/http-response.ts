/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Dictionary } from "@contextjs/collections";
import { File } from "@contextjs/io";
import { Throw } from "@contextjs/system";
import fs from "fs";
import { ServerResponse } from "http";
import { pipeline } from "stream/promises";
import { IHttpResponse } from "./interfaces/i-http-response.js";
import { BufferEncoding } from "./models/buffer-encoding.js";
import { HttpHeader } from "./models/http-header.js";
import { HttpResponseBuffer } from "./models/http-response-buffer.js";

export class HttpResponse implements IHttpResponse {
    private buffer: HttpResponseBuffer[] = [];
    private headers = new Dictionary<string, HttpHeader>();
    public statusCode = 200;

    public constructor(private readonly serverResponse: ServerResponse) {
        Throw.ifNullOrUndefined(serverResponse);
    }

    public end(): void {
        this.writeHeaders();
        this.writeStatusCode();
        this.writeBuffer();

        this.serverResponse.end();
    }

    public write(text: string, encoding?: BufferEncoding): void {
        this.buffer.push(new HttpResponseBuffer(text, encoding ?? "utf-8"));
    }

    public async streamAsync(filePath: string): Promise<void> {
        if (!File.exists(filePath)) {
            this.statusCode = 404;
            return;
        }

        const stream = fs.createReadStream(filePath);

        this.writeHeaders();
        this.writeStatusCode();

        await pipeline(stream, this.serverResponse);
    }

    public setHeader(name: string, value: number | string | string[]): void {
        this.headers.set(name, new HttpHeader(name, value));
    }

    public appendHeader(name: string, value: number | string): void {
        const existing = this.headers.get(name);

        if (!existing) {
            this.setHeader(name, value);
            return;
        }

        const currentValue = existing.value;

        if (Array.isArray(currentValue))
            existing.value = [...currentValue, value.toString()];
        else
            existing.value = [currentValue.toString(), value.toString()];

        this.headers.set(name, existing);
    }


    private writeStatusCode(): void {
        this.serverResponse.statusCode = this.statusCode;
    }

    private writeHeaders(): void {
        if (this.serverResponse.headersSent)
            return;

        for (const header of this.headers.values())
            this.serverResponse.setHeader(header.name, header.value);

        this.headers.clear();
    }

    public flush(): void {
        this.writeHeaders();
        this.writeStatusCode();
        this.writeBuffer();
    }

    private writeBuffer(): void {
        this.buffer.forEach(b => this.serverResponse.write(b.value, b.encoding));
        this.buffer = [];
    }
}