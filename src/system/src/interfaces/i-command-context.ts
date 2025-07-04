/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ConsoleArgument } from "../models/console-argument.js";

export interface ICommandContext {
    parsedArguments: ConsoleArgument[];
    compilerExtensions: string[];
}