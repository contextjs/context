/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Readable } from "node:stream";
import { HeaderCollection } from "./header.collection.js";

export class Request {
    public method!: string;
    public path!: string;
    public headers: HeaderCollection = new HeaderCollection();
    public body!: Readable;

    public initialize(
        method: string,
        path: string,
        headers: HeaderCollection,
        body: Readable): this {
        this.method = method;
        this.path = path;
        this.headers = headers;
        this.body = body;

        return this;
    }

    public reset(): this {
        this.method = undefined!;
        this.path = undefined!;
        this.headers.clear();
        this.body = undefined!;

        return this;
    }
}