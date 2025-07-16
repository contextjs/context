/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ICommandContext } from '@contextjs/system';
import { ServerContext } from './models/server-context.js';

export async function runAsync(context: ICommandContext) {
    new ServerContext().listen();
}