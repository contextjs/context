/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { WebServerException } from "./webserver.exception.js";

export class ResponseSentException extends WebServerException {
    public constructor(message?: string, options?: ErrorOptions) {
        super(message ?? "Response has already been sent", options);
        this.name = ResponseSentException.name;
    }
}