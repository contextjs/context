/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Console, ICommandContext } from "@contextjs/system";

export class CommandContextService {
    public static async create(): Promise<ICommandContext> {
        return { parsedArguments: Console.parseArguments(process.argv.slice(2)), compilerExtensions: [] };
    }
}