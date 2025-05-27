/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ServerHttp2Stream } from "http2";
import { Socket } from "net";
import { Readable } from "stream";
import { HeaderCollection } from "./header.collection.js";
import { HttpVerb } from "./http-verb.js";
import { Request } from "./request.js";
import { Response } from "./response.js";
import { Protocol } from "./protocol.js";

export class HttpContext {
    public readonly request = new Request();
    public readonly response = new Response();

    public initialize(
        protocol: Protocol,
        host: string,
        port: number,
        method: HttpVerb,
        path: string,
        headers: HeaderCollection,
        target: Socket | ServerHttp2Stream,
        body: Readable): this {
        this.request.initialize(protocol, host, port, method, path, headers, body);
        this.response.initialize(target);

        return this;
    }

    public reset(): this {
        this.request.reset();
        this.response.reset();

        return this;
    }
}