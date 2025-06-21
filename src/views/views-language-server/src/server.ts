/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ServerContext } from './server-context.js';
import { ServerOptions } from './server-options.js';

export class Server {
    public static start(options: ServerOptions): void {
        new ServerContext(options).listen();
    }
}