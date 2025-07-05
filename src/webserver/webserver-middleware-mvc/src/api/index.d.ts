/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import "@contextjs/webserver";

/**
 * Extends the WebServerOptions interface with a method to configure views.
 */
declare module "@contextjs/webserver" {
    export interface WebServerOptions {
        useMVC(): WebServerOptions;
    }
}