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
    public readonly type: CommandType;
    public readonly args: ConsoleArgument[];

    constructor(
        type: CommandType,
        args: ConsoleArgument[]) {
        this.type = type;
        this.args = args;
    }
}