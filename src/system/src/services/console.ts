/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import readline from 'node:readline';
import { styleText } from 'node:util';
import typescript from 'typescript';
import { ConsoleMessage } from '../extensions/console-extensions.js';
import { ObjectExtensions } from "../extensions/object.extensions.js";
import { ConsoleArgument } from "../models/console-argument.js";

export class Console {
    private static output = console.log;

    public static parseArguments(args: string[]): ConsoleArgument[] {
        const parsedArguments: ConsoleArgument[] = [];

        if (args.length === 0)
            return parsedArguments;

        let currentArgument: ConsoleArgument | null = null;

        for (const argument of args) {
            if (argument.startsWith("--") && argument.includes("=")) {
                const [name, ...rest] = argument.split("=");
                const value = rest.join("=");
                const existing = parsedArguments.find(a => a.name === name);
                if (existing)
                    existing.values.push(value);
                else
                    parsedArguments.push(new ConsoleArgument(name, [value]));

                currentArgument = null;
                continue;
            }

            if (argument.startsWith("-")) {
                if (!this.isValidArgument(argument)) {
                    this.writeLineError(`Invalid argument: "${argument}".`);
                    this.writeLineWarning("Arguments must start with a single or double dash and be followed by a name.");
                    process.exit(1);
                }

                const existing = parsedArguments.find(a => a.name === argument);
                if (existing)
                    currentArgument = existing;
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
        }

        return parsedArguments;
    }

    public static parseTypescriptArguments(allArgs: ConsoleArgument[], verbose: boolean = false): typescript.CompilerOptions {
        const tsArgs: string[] = [];

        for (const arg of allArgs) {
            if (!arg.name.startsWith("--"))
                continue;

            if (arg.values.length === 0) {
                tsArgs.push(arg.name);
            } else {
                tsArgs.push(arg.name, ...arg.values);
            }
        }

        const parsed = typescript.parseCommandLine(tsArgs);

        if (parsed.errors.length > 0) {
            for (const error of parsed.errors) {
                this.writeLineError(typescript.flattenDiagnosticMessageText(error.messageText, "\n"));
            }
        }

        if (verbose) {
            this.writeLineInfo("Parsed TypeScript options:");
            for (const [key, value] of Object.entries(parsed.options))
                this.writeLine(`  --${key}: ${JSON.stringify(value)}`);
        }

        return parsed.options;
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
        this.output(message, ...messages);
    }

    public static writeLineFormatted(message: ConsoleMessage, ...messages: ConsoleMessage[]): void {
        this.output(styleText(message.format, message.text), ...messages.map(m => styleText(m.format, m.text)));
    }

    public static removeLastLine(): void {
        readline.moveCursor(process.stdout, 0, -1);
        readline.clearLine(process.stdout, 1);
    }

    public static setOutput(writer: (...args: any[]) => void): void {
        this.output = writer;
    }

    public static resetOutput(): void {
        this.output = console.log;
    }

    private static isValidArgument(arg: string): boolean {
        return (arg[1] === '-' && arg.length > 2) || (arg[1] !== '-' && arg.length === 2);
    }
}