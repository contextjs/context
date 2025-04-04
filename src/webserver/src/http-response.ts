/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { File } from "@contextjs/io";
import { Throw } from "@contextjs/system";
import * as fs from 'fs';
import { ServerResponse } from "http";
import { pipeline } from "stream/promises";
import { IHttpResponse } from "./interfaces/i-http-response.js";
import { BufferEncoding } from "./models/buffer-encoding.js";
import { HttpHeader } from "./models/http-header.js";
import { HttpResponseBuffer } from "./models/http-response-buffer.js";

export class HttpResponse implements IHttpResponse {
    private buffer: HttpResponseBuffer[] = [];
    private headers: HttpHeader[] = [];
    public statusCode: number = 200;

    constructor(private readonly serverResponse: ServerResponse) {
        Throw.ifNullOrUndefined(serverResponse);
    }

    public end(): void {
        if (!this.serverResponse.headersSent)
            this.writeHeaders();
        this.writeStatusCode();
        this.writeBuffer();

        this.serverResponse.end();
    }

    public write(text: string, encoding?: BufferEncoding): void {
        this.buffer.push(new HttpResponseBuffer(text, encoding || "utf-8"));
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

    public setHeader(name: string, value: string) {
        const existingHeader = this.headers.find(h => h.name === name);
        if (existingHeader)
            this.headers.splice(this.headers.indexOf(existingHeader), 1);

        this.headers.push(new HttpHeader(name, value));
    }

    private writeStatusCode() {
        this.serverResponse.statusCode = this.statusCode;
    }

    private async writeHeaders(): Promise<void> {
        this.headers.forEach(item => this.serverResponse.setHeader(item.name, item.value));
        this.headers = [];
    }

    private writeBuffer(): void {
        this.buffer.forEach(item => this.serverResponse.write(item.value, item.encoding));
        this.buffer = [];
    }
}