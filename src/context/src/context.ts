/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { CommandType } from "./models/command-type.js";
import { CommandsService } from "./services/commands.service.js";
import { BuildCommand } from "./services/commands/build.command.js";
import { ContextCommand } from "./services/commands/context.command.js";
import { NewCommand } from "./services/commands/new.command.js";
import { VersionCommand } from "./services/commands/version.command.js";
import { WatchCommand } from "./services/commands/watch.command.js";

process.title = 'ContextJS';

const command = CommandsService.parse();

switch (command.type) {
    case CommandType.Context:
        await new ContextCommand().runAsync(command);
        break;
    case CommandType.New:
        await new NewCommand().runAsync(command);
        break;
    case CommandType.Build:
        await new BuildCommand().runAsync(command);
        break;
    case CommandType.Watch:
        await new WatchCommand().runAsync(command);
        break;
    case CommandType.Version:
        await new VersionCommand().runAsync(command);
        break;
    default:
        console.error('Invalid command. Exiting...');
        process.exit(1);
}
