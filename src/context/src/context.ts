#!/usr/bin/env node

/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Console, VersionService } from "@contextjs/system";
import { CommandContextService } from "./services/command-context.service.js";
import { CommandDelegationService } from "./services/command-delegation.service.js";
import { HelpService } from "./services/help.service.js";

process.title = 'ContextJS';

process.on("unhandledRejection", error => {
    Console.writeLineError("Unhandled exception: " + (error instanceof Error ? error.message : String(error)));
    process.exit(1);
});

const commandContext = await CommandContextService.create();

if (!commandContext.parsedArguments.length) {
    VersionService.display();
    Console.writeLineWarning("Try 'ctx --help' or 'ctx -h' to list all templates and commands.");
    process.exit(0);
}

const [commandArgument] = commandContext.parsedArguments;

switch (commandArgument.name) {
    case "-h":
    case "--help":
        HelpService.display(commandContext);
        break;
    case "-v":
    case "--version":
        VersionService.display();
        break;
    default:
        await CommandDelegationService.delegate(commandContext);
        break;
}