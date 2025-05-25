/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ServerHttp2Stream } from "node:http2";
import { Socket } from "node:net";
import { Http1Response } from "./http1-response.js";
import { Http2Response } from "./http2-response.js";

export class Response {
    private http1 = new Http1Response();
    private http2 = new Http2Response();
    private response: Http1Response | Http2Response = this.http1;
    private onEndCallbacks: Array<() => void | Promise<void>> = [];

    public initialize(target: Socket | ServerHttp2Stream): this {
        this.onEndCallbacks = [];

        if (this.isHttp2Stream(target)) {
            this.http2.initialize(target as ServerHttp2Stream);
            this.response = this.http2;
        }
        else {
            this.http1.initialize(target as Socket);
            this.response = this.http1;
        }

        return this;
    }

    public reset(): this {
        this.response.reset();
        this.onEndCallbacks = [];

        return this;
    }

    public setConnectionClose(close: boolean): this {
        this.response.setConnectionClose(close);

        return this;
    }

    public setHeader(name: string, value: string | number | string[]): this {
        this.response.setHeader(name, value);

        return this;
    }

    public setStatus(code: number, message: string): this {
        this.response.setStatus(code, message);

        return this;
    }

    public onEnd(callback: () => void | Promise<void>): this {
        this.onEndCallbacks.push(callback);

        return this;
    }

    private async invokeOnEnd(): Promise<void> {
        for (const callback of this.onEndCallbacks)
            await callback();
    }

    public async sendAsync(body: string | Buffer): Promise<void> {
        await this.invokeOnEnd();
        this.response.send(body);
    }

    public async streamAsync(bodyStream: NodeJS.ReadableStream): Promise<void> {
        await this.invokeOnEnd();
        this.response.stream(bodyStream);
    }

    public async endAsync(): Promise<void> {
        await this.invokeOnEnd();
        this.response.end();
    }

    private isHttp2Stream(target: any): target is ServerHttp2Stream {
        return typeof (target as ServerHttp2Stream).respond === "function" &&
            typeof (target as ServerHttp2Stream).end === "function";
    }
}