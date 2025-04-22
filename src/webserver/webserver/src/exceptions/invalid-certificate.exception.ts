/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Exception } from "@contextjs/system";

export class InvalidCertificateException extends Exception {
    public constructor(name: string) {
        super(`Invalid certificate: ${name}`);
        this.name = InvalidCertificateException.name;
    }
}