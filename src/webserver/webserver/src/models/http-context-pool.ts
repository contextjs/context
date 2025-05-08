/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { HttpContextPoolException } from "../exceptions/http-context-pool.exception.js";
import { HttpContext } from "./http-context.js";

export class HttpContextPool {
    private pool: HttpContext[];
    private head = 0;
    private tail = 0;
    private readonly indexMask: number;

    constructor(size: number = 1024) {
        if (size < 1 || (size & (size - 1)) !== 0)
            throw new HttpContextPoolException("HTTP Context Pool size must be a positive power of two.");

        this.pool = new Array<HttpContext>(size);

        for (let i = 0; i < size; i++)
            this.pool[i] = new HttpContext();

        this.indexMask = size - 1;
    }

    acquire(): HttpContext {
        if (this.head === this.tail)
            return new HttpContext();

        const ctx = this.pool[this.head & this.indexMask];
        this.head++;
        return ctx;
    }

    release(httpContext: HttpContext): this {
        httpContext.reset();
        this.pool[this.tail & this.indexMask] = httpContext;
        this.tail++;
        
        return this;
    }
}