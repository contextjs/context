/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

export enum CommandType {
    Ctx,
    New,
    Build,
    Watch,
    Version
}

export class CommandTypeExtensions {
    public static fromString(command: string): CommandType | null {
        switch (command.toLowerCase()) {
            case "ctx":
                return CommandType.Ctx;
            case "new":
                return CommandType.New;
            case "build":
                return CommandType.Build;
            case "watch":
                return CommandType.Watch;
            case "version":
                return CommandType.Version;
            default:
                return null;
        }
    }
}