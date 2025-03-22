/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/context-js/context/blob/main/LICENSE
 */

import { ConsoleService, ObjectExtensions } from "@contextjs/core";
import readline from 'node:readline';
import { CommandTypeMethods } from "../models/command-type.js";
import { Command } from "../models/command.js";

export class CLIService {

    public static writeLine(message: string): void {
        console.log(message);
    }

    public static removeLastLine(): void {
        readline.clearLine(process.stdout, 0);
    }

    public static parse(): Command {
        const args = process.argv.slice(2);

        if (args.length === 0) {
            console.error('No arguments provided. Exiting...');
            return process.exit(1);
        }

        const command = CommandTypeMethods.fromString(args[0]);
        if (ObjectExtensions.isNullOrUndefined(command)) {
            console.error('Invalid command provided');
            return process.exit(1);
        }

        const parsedArguments = ConsoleService.parseArguments(args.slice(1));

        return new Command(command!, parsedArguments);
    }
}