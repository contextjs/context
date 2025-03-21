/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/context-js/context/blob/main/LICENSE
 */

import { StringExtensions } from "@contextjs/core";

export enum CommandType {
    New,
    Build,
    Watch,
    Version
}

export class CommandTypeMethods {
    public static fromString(command: string): CommandType | null {
        if (StringExtensions.isNullOrWhiteSpace(command))
            return null;

        switch (command.toLowerCase()) {
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