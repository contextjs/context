/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ConsoleArgument } from "@contextjs/core";
import { CommandType } from "./command-type.js";

export class Command {
    constructor(
        public readonly type: CommandType,
        public readonly args: ConsoleArgument[]) { }
}