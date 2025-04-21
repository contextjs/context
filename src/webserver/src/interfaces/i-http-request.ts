/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { HttpHeader } from "../models/http-header.js";

export interface IHttpRequest {
    readonly httpVersion: string;
    readonly headers: HttpHeader[];
    readonly httpMethod: string | null;
    readonly url: string | null;
    readonly statusCode: number | null;
    readonly statusMessage: string | null;
    readonly host: string | null;
}