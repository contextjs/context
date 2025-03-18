/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/context-js/context/blob/main/LICENSE
 */

import { VersionService } from "@contextjs/core";
import { Command } from "../../models/command.mjs";
import { CommandBase } from "./command-base.mjs";

export class VersionCommand extends CommandBase {
    public async runAsync(command: Command): Promise<void> {
        VersionService.display();
    }
}