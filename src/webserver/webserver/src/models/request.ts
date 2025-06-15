/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Dictionary } from "@contextjs/collections";
import { ObjectExtensions, StringExtensions } from "@contextjs/system";
import { Readable } from "node:stream";
import { HeaderCollection } from "./header.collection.js";
import { HttpVerb } from "./http-verb.js";
import type { Protocol } from "./protocol.js";

export class Request {
    public protocol!: Protocol;
    public host!: string;
    public port!: number;
    public method!: HttpVerb;
    public headers: HeaderCollection = new HeaderCollection();
    public body!: Readable;

    private fullPath!: string;
    private _path?: string;
    private _rawQuery?: string;
    private parsedQuery?: Dictionary<string, string | string[]>;

    public initialize(
        protocol: Protocol,
        host: string,
        port: number,
        method: HttpVerb,
        fullPath: string,
        headers: HeaderCollection,
        body: Readable): this {
        this.protocol = protocol;
        this.host = host;
        this.port = port;
        this.method = method;
        this.fullPath = fullPath;
        this.headers = headers;
        this.body = body;

        this.parsedQuery = undefined;

        return this;
    }

    public reset(): this {
        this.protocol = undefined!;
        this.host = undefined!;
        this.port = undefined!;
        this.method = undefined!;
        this.fullPath = undefined!;
        this.body = undefined!;
        this.parsedQuery = undefined;

        this.headers.clear();

        return this;
    }

    public get path(): string {
        if (StringExtensions.isNullOrWhitespace(this._path)) {
            const index = this.fullPath.indexOf("?");
            return index >= 0
                ? this.fullPath.slice(0, index)
                : this.fullPath;
        }

        return this._path;
    }

    public get rawQuery(): string {
        if (StringExtensions.isNullOrWhitespace(this._rawQuery)) {
            const index = this.fullPath.indexOf("?");
            return index >= 0
                ? this.fullPath.slice(index + 1)
                : "";
        }

        return this._rawQuery;
    }

    public get queryParams(): Dictionary<string, string | string[]> {
        if (!ObjectExtensions.isNullOrUndefined(this.parsedQuery))
            return this.parsedQuery;

        const rawQuery = this.rawQuery;
        const result = new Dictionary<string, string | string[]>();
        if (StringExtensions.isNullOrWhitespace(rawQuery))
            return result;

        for (const part of rawQuery.split("&")) {
            if (StringExtensions.isNullOrWhitespace(part))
                continue;

            const [key, value = ""] = part.split("=").map(decodeURIComponent);
            if (!result.has(key))
                result.set(key, value);
            else {
                const currentValue = result.get(key)!;
                if (Array.isArray(currentValue))
                    currentValue.push(value);
                else
                    result.set(key, [currentValue, value]);
            }
        }

        this.parsedQuery = result;
        return result;
    }
}