/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { WebServerOptionsBase } from "./webserver-options-base.js";

export class HttpWebServerOptions extends WebServerOptionsBase {
    public constructor(
        enabled?: boolean,
        host?: string,
        port?: number,
        keepAliveTimeout?: number) {
        super();
        this.normalize(enabled, host, port, keepAliveTimeout);
    }

    private normalize(enabled?: boolean, host?: string, port?: number, keepAliveTimeout?: number): void {
        this.enabled = enabled ?? true;
        this.port = port ?? 80;
        this.keepAliveTimeout = keepAliveTimeout ?? 5000;
        this.host = host ?? "localhost";
    }
}