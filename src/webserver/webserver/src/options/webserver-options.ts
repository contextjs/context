/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { IMiddleware } from "../interfaces/i-middleware.js";
import { WebServerEvent } from "../models/webserver-event.js";
import { WebServer } from "../webserver.js";
import { GeneralWebServerOptions } from "./general-webserver-options.js";
import { HttpWebServerOptions } from "./http-webserver-options.js";
import { HttpsWebServerOptions } from "./https-webserver-options.js";

export class WebServerOptions {
    public webServer!: WebServer;
    public general: GeneralWebServerOptions;
    public http: HttpWebServerOptions;
    public https: HttpsWebServerOptions;
    public onEvent!: (event: WebServerEvent) => void;

    public constructor(
        general?: GeneralWebServerOptions,
        http?: HttpWebServerOptions,
        https?: HttpsWebServerOptions,
        onEvent?: (event: WebServerEvent) => void) {
        this.general = general ?? new GeneralWebServerOptions();
        this.http = http ?? new HttpWebServerOptions();
        this.https = https ?? new HttpsWebServerOptions();
        this.onEvent = onEvent ?? (() => { });
    }
}