/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { StringExtensions, Throw } from "@contextjs/system";
import { IncomingMessage } from "http";
import { IHttpRequest } from "./interfaces/i-http-request.js";
import { HttpHeader } from "./models/http-header.js";

export class HttpRequest implements IHttpRequest {
    public readonly httpVersion: string;
    public readonly headers: HttpHeader[] = [];
    public readonly httpMethod: string | null;
    public readonly url: string | null;
    public readonly statusCode: number | null;
    public readonly statusMessage: string | null;
    public readonly host: string | null;

    constructor(incomingMessage: IncomingMessage) {
        Throw.ifNullOrUndefined(incomingMessage);

        for (var item in incomingMessage.headers)
            this.headers.push(new HttpHeader(item, incomingMessage.headers[item] ?? StringExtensions.empty));

        this.httpVersion = incomingMessage.httpVersion;
        this.httpMethod = incomingMessage.method || null;
        this.url = incomingMessage.url || null;
        this.statusCode = incomingMessage.statusCode || null;
        this.statusMessage = incomingMessage.statusMessage || null;
        this.host = incomingMessage.headers.host || null;
    }
}