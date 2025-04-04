/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Throw } from "@contextjs/system";
import { IHttpContext } from "./interfaces/i-http-context.js";
import { IHttpRequest } from "./interfaces/i-http-request.js";
import { IHttpResponse } from "./interfaces/i-http-response.js";

export class HttpContext implements IHttpContext {
    constructor(
        public readonly request: IHttpRequest,
        public readonly response: IHttpResponse) {
        Throw.ifNullOrUndefined(request);
        Throw.ifNullOrUndefined(response);
    }
}