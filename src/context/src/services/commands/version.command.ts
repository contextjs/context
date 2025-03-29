/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { VersionService } from "@contextjs/system";
import { Command } from "../../models/command.js";
import { CommandBase } from "./command-base.js";

export class VersionCommand extends CommandBase {
    public async runAsync(command: Command): Promise<void> {
        VersionService.display();
    }
}