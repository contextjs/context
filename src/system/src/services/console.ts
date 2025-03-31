/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import readline from 'node:readline';
import { styleText } from 'node:util';
import { ConsoleMessage } from '../extensions/console-extensions.js';
import { ObjectExtensions } from "../extensions/object.extensions.js";
import { ConsoleArgument } from "../models/console-argument.js";

export class Console {
    public static parseArguments(args: string[]): ConsoleArgument[] {
        let parsedArguments: ConsoleArgument[] = [];

        if (args.length == 0)
            return parsedArguments;

        let currentArgument: ConsoleArgument | null = null;

        args.forEach(argument => {
            if (argument.startsWith('-')) {
                if ((argument[1] === '-' && argument.length == 3) ||
                    (argument[1] !== '-' && argument.length !== 2)) {
                    Console.writeLineFormatted({ format: 'red', text: `Invalid argument: "${argument}".` });
                    return process.exit(1);
                }

                const existingArgument = parsedArguments.find(a => a.name === argument);
                if (existingArgument)
                    currentArgument = existingArgument;
                else {
                    currentArgument = new ConsoleArgument(argument, []);
                    parsedArguments.push(currentArgument);
                }
            }
            else {
                if (ObjectExtensions.isNullOrUndefined(currentArgument)) {
                    currentArgument = new ConsoleArgument(argument, []);
                    parsedArguments.push(currentArgument);
                }
                else
                    currentArgument!.values.push(argument);
            }
        });

        return parsedArguments;
    }

    public static writeLineError(message: any, ...messages: any[]): void {
        this.writeLineFormatted({ format: 'red', text: message }, ...messages.map<ConsoleMessage>(m => ({ format: 'red', text: m })));
    }

    public static writeLineWarning(message: any, ...messages: any[]): void {
        this.writeLineFormatted({ format: 'yellow', text: message }, ...messages.map<ConsoleMessage>(m => ({ format: 'yellow', text: m })));
    }

    public static writeLineInfo(message: any, ...messages: any[]): void {
        this.writeLineFormatted({ format: 'blue', text: message }, ...messages.map<ConsoleMessage>(m => ({ format: 'blue', text: m })));
    }

    public static writeLineSuccess(message: any, ...messages: any[]): void {
        this.writeLineFormatted({ format: 'green', text: message }, ...messages.map<ConsoleMessage>(m => ({ format: 'green', text: m })));
    }

    public static writeLine(message: any, ...messages: any[]): void {
        console.log(message, ...messages);
    }

    public static writeLineFormatted(message: ConsoleMessage, ...messages: ConsoleMessage[]): void {
        console.log(styleText(message.format, message.text), ...messages.map(m => styleText(m.format, m.text)));
    }

    public static removeLastLine(): void {
        readline.moveCursor(process.stdout, 0, -1);
        readline.clearLine(process.stdout, 1);
    }
}