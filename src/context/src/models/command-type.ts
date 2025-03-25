/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { StringExtensions } from "@contextjs/core";

export enum CommandType {
    Context,
    New,
    Build,
    Watch,
    Version
}

export class CommandTypeExtensions {
    public static fromString(command: string): CommandType | null {
        if (StringExtensions.isNullOrWhiteSpace(command))
            return null;

        switch (command.toLowerCase()) {
            case "ctx":
                return CommandType.Context;
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