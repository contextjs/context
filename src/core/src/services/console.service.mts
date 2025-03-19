/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/context-js/context/blob/main/LICENSE
 */

import { ObjectExtensions } from "../extensions/object.extensions.mjs";
import { ConsoleArgument } from "../models/console-argument.mjs";

export class ConsoleService {
    public static parseArguments(args: string[]): ConsoleArgument[] {
        let parsedArguments: ConsoleArgument[] = [];

        if (args.length == 0)
            return parsedArguments;

        let currentArgument: ConsoleArgument | null = null;

        args.forEach(argument => {
            if (argument.startsWith('-')) {
                argument = argument.replace(/^-+/, '');

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
                    console.error('Argument value provided without argument name');
                    return process.exit(1);
                }

                currentArgument!.values.push(argument);
            }
        });

        return parsedArguments;
    }
}