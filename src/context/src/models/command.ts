/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ConsoleArgument } from "@contextjs/system";
import { CommandType } from "./command-type.js";

export class Command {
    public constructor(
        public readonly type: CommandType,
        public readonly args: ConsoleArgument[]
    ) { }
}