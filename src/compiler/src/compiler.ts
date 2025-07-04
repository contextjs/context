/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Console, ConsoleArgument } from "@contextjs/system";
import typescript from "typescript";
import { ICompilerExtension } from "./interfaces/i-compiler-extension.js";
import { BuildService } from "./services/build.service.js";
import { ExtensionsService } from "./services/extensions.service.js";
import { WatchService } from "./services/watch.service.js";

export class Compiler {
    public static compile = BuildService.execute;
    public static watch = WatchService.execute;

    public static registerExtension(extension: ICompilerExtension): void {
        ExtensionsService.register(extension);
    }

    public static parseTypescriptArguments(consoleArguments: ConsoleArgument[], verbose: boolean = false): typescript.CompilerOptions {
        const typescriptArguments: string[] = [];

        for (const consoleArgument of consoleArguments) {
            if (!consoleArgument.name.startsWith("--"))
                continue;
            else if (consoleArgument.name === "--extensions" || consoleArgument.name === "-e") {
                if (verbose)
                    Console.writeLineInfo(`Skipping custom CLI flag: ${consoleArgument.name}`);
                continue;
            }

            if (consoleArgument.values.length === 0)
                typescriptArguments.push(consoleArgument.name);
            else
                typescriptArguments.push(consoleArgument.name, ...consoleArgument.values);
        }

        const parsed = typescript.parseCommandLine(typescriptArguments);

        if (parsed.errors.length > 0)
            for (const error of parsed.errors)
                Console.writeLineError(typescript.flattenDiagnosticMessageText(error.messageText, "\n"));

        if (verbose) {
            Console.writeLineInfo("Parsed TypeScript options:");
            for (const [key, value] of Object.entries(parsed.options))
                Console.writeLine(`  --${key}: ${JSON.stringify(value)}`);
        }

        return parsed.options;
    }
}