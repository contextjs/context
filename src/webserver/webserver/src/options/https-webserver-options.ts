/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { SSLCertificate } from "../models/ssl-certificate.js";
import { WebServerOptionsBase } from "./webserver-options-base.js";

export class HttpsWebServerOptions extends WebServerOptionsBase {
    public certificate!: SSLCertificate;

    public constructor(
        enabled?: boolean,
        host?: string,
        port?: number,
        certificate?: SSLCertificate,
        keepAliveTimeout?: number) {
        super();

        this.normalize(enabled, host, port, certificate, keepAliveTimeout);
    }

    private normalize(enabled?: boolean, host?: string, port?: number, certificate?: SSLCertificate, keepAliveTimeout?: number): void {
        this.enabled = enabled ?? false;
        this.port = port ?? 443;
        this.keepAliveTimeout = keepAliveTimeout ?? 5000;
        this.host = host ?? "localhost";
        this.certificate = certificate ?? { cert: "", key: "" };
    }
}