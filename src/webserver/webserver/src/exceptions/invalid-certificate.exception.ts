/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { WebServerException } from "./webserver.exception.js";

export class InvalidCertificateException extends WebServerException {
    public constructor(name: string) {
        super(`Invalid certificate: ${name}`);
        this.name = InvalidCertificateException.name;
    }
}