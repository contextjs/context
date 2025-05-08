/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { WebServerException } from "./webserver.exception.js";

export class MiddlewareExistsException extends WebServerException {
    public constructor(name: string, options?: ErrorOptions) {
        super(`Middleware "${name}" already exists.`, options);
        this.name = MiddlewareExistsException.name;
    }
}