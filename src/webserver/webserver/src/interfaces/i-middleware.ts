/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { HttpContext } from "../models/http-context.js";

export interface IMiddleware {
    name: string;
    version?: string;

    onRequest(httpContext: HttpContext, next?: () => Promise<void> | void): Promise<void> | void;
}