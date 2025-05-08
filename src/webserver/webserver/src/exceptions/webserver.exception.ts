/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { SystemException } from "@contextjs/system";

export class WebServerException extends SystemException {
    public constructor(message?: string, options?: ErrorOptions) {
        super(message ?? "Web Server encountered an unknown exception.", options);
        this.name = WebServerException.name;
    }
}