/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { IHttpContext } from "../interfaces/i-http-context.js";

export interface IMiddleware {
    name: string;
    version: string;

    onRequestAsync(httpContext: IHttpContext, next: () => Promise<void>): Promise<void>;
    onErrorAsync?(exception: any): Promise<void>;
}