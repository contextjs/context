/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { CommandAliases } from "./command-aliases.js";
import { CommandType } from "./command-type.js";

const commandMap: Record<string, CommandType> = {
    ctx: CommandType.Ctx,
    new: CommandType.New,
    build: CommandType.Build,
    restore: CommandType.Restore,
    watch: CommandType.Watch,
    version: CommandType.Version
};

export class CommandTypeExtensions {
    public static fromString(value: string): CommandType | null {
        const lower = value.toLowerCase();
        const resolved = CommandAliases[lower] ?? lower;
        return commandMap[resolved] ?? null;
    }
}